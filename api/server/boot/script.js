// myapp用户
// myAppUser.create([
//     {username: 'John', email: 'john@doe.com', password: 'opensesame'},
//     {username: 'Jane', email: 'jane@doe.com', password: 'opensesame'},
//     {username: 'Bob', email: 'bob@projects.com', password: 'opensesame'}
//   ], function(err, users) {
//     if (err) return cb(err);
//
//     //create the admin role
//     Role.create({
//       name: 'admin'
//     }, function(err, role) {
//       if (err) cb(err);
//
//       //make bob an admin
//       role.principals.create({
//         principalType: RoleMapping.USER,
//         principalId: users[2].id
//       }, function(err, principal) {
//         cb(err);
//       });
//     });
//   });

// //管理界面用户
// adminUser.create([
//     {username: 'lidikang', email: 'andyliwr@outlook.com', password: '121960425admin'},
//     {username: 'Jane', email: 'jane@doe.com', password: 'opensesame'},
//     {username: 'Bob', email: 'bob@projects.com', password: 'opensesame'}
//   ], function(err, users) {
//     if (err) return cb(err);
//
//     //create the admin role
//     Role.create({
//       name: 'lidikang'
//     }, function(err, role) {
//       if (err) cb(err);
//
//       //make bob an admin
//       role.principals.create({
//         principalType: RoleMapping.adminUser ,
//         principalId: users[0].id
//       }, function(err, principal) {
//         cb(err);
//       });
//     });
//   });

// module.exports = function(app) {
//     var User = app.models.User;
//     User.create({email: 'foo@bar.com', password: 'bar'}, function(err, user) {
//       console.log(user);
//     });
//   }

// var server = require('../server');
// var ds = server.dataSources.db;
// var lbTables = ['AdminUser','Email','MyAppUser'];
// ds.automigrate(lbTables, function(er) {
//   if (er) throw er;
//   console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
//   ds.disconnect();
// });
