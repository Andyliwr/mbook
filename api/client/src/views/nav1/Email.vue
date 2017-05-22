<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="searchStr" placeholder="输入要检索的字段"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="findEmail">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="emails" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" :row-class-name="isShowColumn">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="40">
			</el-table-column>
			<el-table-column prop="from.username" label="发送人" width="100" >
				<template scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><img class="avatar" v-bind:src="scope.row.from.avatar" alt="" /><span class="username" v-html="scope.row.from.username+ '（' + scope.row.from.username + '）'"></span></p>
						<div slot="reference" class="name-wrapper">
							<el-tag v-bind:class="[ scope.row.from.isSearch? 'nameActive': '' ]">{{ scope.row.from.username }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="to.username" label="收件人" width="100" >
				<template scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><img class="avatar" v-bind:src="scope.row.to.avatar" alt="" /><span class="username" v-html="scope.row.to.username + '（'+scope.row.to.username+'）'"></span></p>
						<div slot="reference" class="name-wrapper">
							<el-tag v-bind:class="[ scope.row.to.isSearch? 'nameActive': '' ]">{{ scope.row.to.username }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="标题" width="150" sortable>
				<template scope="scope">
						<span v-html="scope.row.title"></span>
				</template>
			</el-table-column>
			<el-table-column label="内容" width="280" sortable>
				<template scope="scope">
						<span v-html="scope.row.content"></span>
				</template>
			</el-table-column>
			<el-table-column label="发送时间" min-width="80" sortable>
					<template scope="scope">
						<el-icon name="time"></el-icon>
						<span style="margin-left: 10px">{{ scope.row.time }}</span>
					</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增邮件" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="收件人" prop="to">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatDate, formatDate3 } from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getEmail, removeEmail, editEmail, addEmail } from '../../api/api';

	export default {
		data() {
			return {
				searchStr: null,
				userId: null,
				emails: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getEmails();
			},
			//获取邮件列表
			getEmails: function(callback) {
				let self = this;
				self.listLoading = true;
				//NProgress.start();
				getEmail(self.userId).then((res) => {
					if(res.code === (-1)){
							// 这里错误提示可以使用vue模板
							alert(res.msg);
					}else{
						this.total = res.length;
						this.emails = res.emails.map(function(item){
							let resultStr = '';
							let nowDate = new Date(item.time);
							let timePre = nowDate.getTime();
							let now = new Date();
							let timeNow = now.getTime();
							if (timeNow >= timePre) {
									let distance = (timeNow - timePre) / 1000;
									if (distance >= 0 && distance < 60) {
											resultStr = '刚刚';
									} else if (distance >= 60 && distance <= (60 * 60)) {
											resultStr = Math.floor(distance / 60) + '分钟前';
									} else if (distance > 3600 && distance <= (24 * 60 * 60)) {
											resultStr = Math.floor(distance / 3600) + "小时前";
									} else if (distance > 86400 && distance / (30 * 24 * 60 * 60)) {
											resultStr = Math.floor(distance / 86400) + "天前"
									} else {
											resultStr = formatTime(date);
									}
							} else {
									console.log('nowTime is behind on this time');
							}
							// 改变item.time
							item.time = resultStr;
							return item;
						});
						self.listLoading = false;
						if(typeof callback === "function"){
							callback();
						}
						// NProgress.done();
					}
				});
			},
			findEmail: function(){
				let self = this;
				if(self.searchStr){
					// 先获取所有邮件然后在前端做检索
					let callback = function(){
						self.emails.forEach(function (item, index, array) {
							//标志位，用来标志是不是需要设置item.isShow = false，如果经历foreach循环没有被设置为false，就认为这不小说不是搜索的结果
							var isNeedtoChage = true;
							//查询邮件title
							if (item.title.indexOf(self.searchStr) >= 0) {
								item.title = self.findAndSigned(self.searchStr, item.title);
								//设置这本小说在搜索之后会显示
								item.isShow = true;
								isNeedtoChage = false;
							}
							//查询邮件内容
							if (item.content.indexOf(self.searchStr) >= 0) {
								item.content = self.findAndSigned(self.searchStr, item.content);
								item.isShow = true;
								isNeedtoChage = false;
							}
							// 查询发布人名字
							if (item.from.username.indexOf(self.searchStr) >= 0) {
								item.from.isSearch = true;
								item.isShow = true;
								isNeedtoChage = false;
							}
							// 查询接受人名字
							if (item.to.username.indexOf(self.searchStr) >= 0) {
								item.to.isSearch = true;
								item.isShow = true;
								isNeedtoChage = false;
							}
							// 查询接受人昵称
							if (item.to.nickname.indexOf(self.searchStr) >= 0) {
								item.to.isSearch = true;
								item.isShow = true;
								isNeedtoChage = false;
							}
							if (isNeedtoChage) {
								item.isShow = false;
							}
						});
					};
					self.getEmails(callback);
				}else{
					self.getEmails();
				}
			},
			findAndSigned: function (searchString, readyToBeSearch) {
				if (typeof searchString == 'string') {
					var regExp = new RegExp(searchString, 'igm');
					var leftStr = ''; //记录关键词左边的字符串
					var rightStr = ''; //记录关键词右边的字符串
					var count = 0; //计数器
					var tempStr = readyToBeSearch; //用于正则匹配的字符串
					var notChageStr = readyToBeSearch; //用于截取字符串，和上面一样的值是因为不能把一个值既用于正则运算又用于记录加入<code></code>的新的字符串,这样会使得循环变成无限循环
					var lastIndex = 0; //记录关键词的位置
					while (regExp.exec(tempStr) != null) {
						console.log(++count);
						lastIndex = regExp.lastIndex + 48 * (count - 1); //每次循环notChageStr并非不变，而是多了<code></code>共计13个字符，所以为了保证后续循环中lastindex的正确性应该将lastindex自增13
						leftStr = notChageStr.substring(0, lastIndex - searchString.length);
						rightStr = notChageStr.substring(lastIndex);
						notChageStr = leftStr + '<span style="background-color: #dc6262;">' + searchString + '</span>' + rightStr;
					}
					return notChageStr;
				} else {
					console.log('The param of findAndSigned is error!....')
					return '';
				}
			},
			isShowColumn(row, index) {
        console.log(row);
				console.log(index);
      },
			//删除
			handleDel: function (index, row) {
				let self = this;
				self.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					self.listLoading = true;
					//NProgress.start();
					let para = { userId: self.userId ,emailId: row.id };
					removeEmail(para).then((res) => {
						self.listLoading = false;
						//NProgress.done();
						self.$message({
							message: '删除成功',
							type: 'success'
						});
						self.getEmails();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getEmails();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getEmails();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getEmails();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			let self = this;
			// 获取userid
			self.userId = localStorage.getItem('userid');
			self.getEmails();
		}
	}

</script>

<style scoped>
	.avatar{
		height: 30px;
		width: 30px;
		display: inline-block;
		vertical-align: middle;
	}
	.username{
		padding-left: 10px;
	}
	.nameActive{
		background: #20A0FF !important;
	}
</style>
