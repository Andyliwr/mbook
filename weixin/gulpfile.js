var path          = require('path');
var gulp          = require('gulp');
var del           = require('del');
var ugjs          = require('gulp-uglify');
var watch         = require('gulp-watch');
var named         = require('vinyl-named');
var postcss       = require('gulp-postcss');
var webpackStream = require('webpack-stream');
var webpack       = require('webpack');
var watchPath     = require('gulp-watch-path');
var chalk         = require('chalk');
var rename        = require('gulp-rename');
var ifElse        = require('gulp-if-else');
var base64        = require('gulp-base64');
var autoprefixer  = require('autoprefixer');
var precss        = require('precss');
var cssnano       = require('cssnano');
var sass          = require('gulp-sass');
var less          = require('gulp-less');
var runSequence   = require('run-sequence');
var replace       = require('gulp-replace');
var notify        = require('gulp-notify');
var plumber       = require('gulp-plumber');
var isBuild       = false;
var ES5DEV        = true;

var webpackConfig = {
	resolve: {
		root: path.join(__dirname, 'node_modules'),
		extensions: ['', '.js', '.scss', '.css']
	},
	output: {
		filename: '[name].js',
	},
	module: {
		preLoaders: [
			// { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
		],
		loaders: [
			{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
		]
	},
	plugins: [],
	babel: { //配置babel
		"presets": ["es2015", 'stage-2'],
		"plugins": ["transform-runtime"]
	}
};

var processes = [
	autoprefixer({ browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4'] }),
	precss,
	cssnano
];

var src  = {
	images: './src/**/*.{png,jpg,jpeg,svg}',
	js: './src/**/*.js',
	sass: './src/**/*.{scss,less,sass}',
	wxss: './src/**/*.wxss',
	wxml: './src/**/*.wxml',
	json: './src/**/*.json',
	views: './src/**/*.{html,wxml}'
};
var dist = './dist/';
gulp.task('clean',function() {
	del([
		'dist/**/*'
	]);
});
gulp.task('dev', function () {
	webpackConfig.plugins.push(new webpack.DefinePlugin({
		NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'production'
	}));
	build(false,function() {
		gulp.start('views', 'sass', 'wxss', 'images', 'js', 'json');
	});
});
gulp.task('dev:es5', function () {
	build(true,function() {
		gulp.start('views', 'sass', 'wxss', 'images', 'js:es5', 'json');
	});
});
 
gulp.task('build', function () {
	isBuild = true;
	webpackConfig.plugins.push(new webpack.DefinePlugin({
		NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'production'
	}));
	build(false, function () {
		setTimeout(function () {
			console.log();
			console.log(chalk.green('	Build success!'));
		}, 0)
	});
});
gulp.task('build:es5', function () {
	isBuild = true;
	ES5DEV  = false;
	build(true, function () {
		setTimeout(function () {
			console.log();
			console.log(chalk.green('	Build success!'));
		}, 0)
	});
});

gulp.task('views', function () {
	watch([src.views], function (e) {
		views();
	})
});
gulp.task('json', function () {
	watch([src.json], function () {
		json()
	});
});

gulp.task('sass', function () {
	watch([src.sass], function (event) {
		var paths = watchPath(event, src.sass, dist);
		
		if (paths.srcPath.indexOf('.scss') > -1 || paths.srcPath.indexOf('.sass') > -1) {
			return compileSass(src.sass, 'dist')
		}
		
		compileLess(src.sass, 'dist')
		
	})
});
gulp.task('wxss', function () {
	watch([src.wxss], function (event) {
		var paths = watchPath(event, src.wxss, dist);
		compileWxss(paths.srcPath, paths.srcDir.replace('src', 'dist')); // 编译 .wxss
	});
	
});
gulp.task('images', function () {
	watch([src.images], function () {
		images();
	})
});

gulp.task('js', function () {
	watch([src.js], function (event) {
		var paths = watchPath(event, src.js, dist);
		compileJS(paths.srcPath);
	})
});
gulp.task('js:es5', function () {
	watch([src.js], function (event) {
		var paths = watchPath(event, src.js, dist);
		compileJSes5(paths.srcPath, paths.srcDir.replace('src', 'dist'));
	})
});

gulp.task('sass:build', function () {
	return compileSass(src.sass, dist)
});
gulp.task('wxss:build', function () {
	return compileWxss(src.wxss, dist)
});
gulp.task('js:build', function () {
	return compileJS([src.js]);
});
gulp.task('js:es5:build', function () {
	return compileJSes5([src.js], dist);
});
function compileJS(path) {
	
	return gulp.src(path)
	.pipe(named(function (file) {
		var path   = JSON.parse(JSON.stringify(file)).history[0];
		var sp     = path.indexOf('\\') > -1 ? 'src\\' : 'src/';
		var target = path.split(sp)[1];
		return target.substring(0, target.length - 3);
	}))
	.pipe(webpackStream(webpackConfig))
	.on('error', function (err) {
		this.end()
	})
	.pipe(ifElse(isBuild === true, ugjs))
	.pipe(gulp.dest(dist))
}
function compileJSes5(path, dist) {
	
	return gulp.src(path)
	.pipe(replace('NODE_ENV', ES5DEV ? 'dev' : 'production'))
	.pipe(ifElse(isBuild === true, ugjs))
	.pipe(gulp.dest(dist))
}
function compileWxss(src, dist) {
	return gulp.src(src)
	.pipe(base64({
		extensions: ['png', /\.jpg#datauri$/i],
		maxImageSize: 10 * 1024 // bytes,
	}))
	.pipe(postcss(processes))
	.pipe(gulp.dest(dist))
}
function compileSass(src, dist) {
	return gulp.src(src)
	.pipe(sass().on('error', sass.logError))
	.pipe(base64({
		extensions: ['png', /\.jpg#datauri$/i],
		maxImageSize: 10 * 1024 // bytes,
	}))
	.pipe(ifElse(isBuild === true, function () {
		return postcss(processes);
	}))
	.pipe(rename({
		extname: ".wxss"
	}))
	.pipe(gulp.dest(dist));
}
function compileLess(src, dist) {
	return gulp.src(src)
	.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
	.pipe(less())
	.pipe(base64({
		extensions: ['png', /\.jpg#datauri$/i],
		maxImageSize: 10 * 1024 // bytes,
	}))
	.pipe(ifElse(isBuild === true, function () {
		return postcss(processes);
	}))
	.pipe(rename({
		extname: ".wxss"
	}))
	.pipe(gulp.dest(dist));
	
}

function images() {
	gulp.src(src.images)
	.pipe(gulp.dest(dist));
}
function views() {
	gulp.src(src.views)
	.pipe(rename({
		extname: ".wxml"
	}))
	.pipe(gulp.dest(dist));
}
function json() {
	gulp.src(src.json)
	.pipe(gulp.dest(dist))
}
function build(ises5, cb) {
	var jsbuild = ises5 ? 'js:es5:build' : 'js:build';
	runSequence('clean',jsbuild, 'sass:build', 'wxss:build', function () {
		views();
		images();
		json();
		cb && cb()
	});
	
}

