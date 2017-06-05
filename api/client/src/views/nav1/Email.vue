<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="searchStr" placeholder="输入要检索的字段" @keyup.enter.native="findEmail"></el-input>
					<input type="text" style="display:none;" />
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
		<el-table :data="emails" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="expand">
				<template scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="发送人：">
							<span>{{ props.row.from.username }}</span>
						</el-form-item>
						<el-form-item label="接受人：">
							<span>{{ props.row.to.username }}</span>
						</el-form-item>
						<el-form-item label="标题：" class="full-width">
							<span>{{ props.row.title }}</span>
						</el-form-item>
						<el-form-item label="内容：" class="full-width">
							<span>{{ props.row.content }}</span>
						</el-form-item>
						<el-form-item label="时间：" class="full-width">
							<span>{{ props.row.time }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column type="selection" width="35">
			</el-table-column>
			<el-table-column type="index" width="60" align="center">
			</el-table-column>
			<el-table-column prop="from.username" label="发送人" width="100" >
				<template scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><img class="avatar" v-bind:src="scope.row.from.avatar" alt="" /><span class="username" v-html="scope.row.from.username+ '(' + scope.row.from.username + ')'"></span></p>
						<div slot="reference" class="name-wrapper">
							<el-tag v-bind:class="[ scope.row.from.isSearch? 'nameActive': '' ]">{{ scope.row.from.username }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="to.username" label="收件人" width="100" >
				<template scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><img class="avatar" v-bind:src="scope.row.to.avatar" alt="" /><span class="username" v-html="scope.row.to.username + '('+scope.row.to.username+')'"></span></p>
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
						<span style="margin-left: 10px">{{ scope.row.formatTime }}</span>
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
        <el-form-item label="收件人" style="margin-bottom: 0px">
          <el-autocomplete class="inline-input" v-model="editForm.inputValue" :fetch-suggestions="addAutoComplete" placeholder="请输入内容" @select="handleUserSelect" icon="circle-close" :on-icon-click="handleCloseClick" :trigger-on-focus="false"></el-autocomplete>
          <br />
          <div class="userTags">
            <el-tag class="el-tag" v-for="tag in editForm.acceptTags" :key="tag.name" :closable="true" :type="tag.type" @close="handleTagClose(tag)">{{ tag.name }}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input class="titleInput" v-model="editForm.title" placeholder="请输入邮件标题"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="">
          <el-date-picker v-model="editForm.time" type="datetime" placeholder="选择发送日期时间" align="left" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input class="titleInput" type="textarea" v-model="editForm.content" :autosize="{ minRows: 6, maxRows: 6}"></el-input>
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
				<el-form-item label="收件人" style="margin-bottom: 0px">
					<el-autocomplete class="inline-input" v-model="addForm.inputValue" :fetch-suggestions="addAutoComplete" placeholder="请输入内容" @select="handleUserSelect" icon="circle-close" :on-icon-click="handleCloseClick" :trigger-on-focus="false"></el-autocomplete>
					<br />
					<div class="userTags">
						<el-tag class="el-tag" v-for="tag in addForm.acceptTags" :key="tag.name" :closable="true" :type="tag.type" @close="handleTagClose(tag)">{{ tag.name }}</el-tag>
					</div>
				</el-form-item>
				<el-form-item label="标题" prop="title">
          <el-input class="titleInput" v-model="addForm.title" placeholder="请输入邮件标题"></el-input>
				</el-form-item>
        <el-form-item label="时间" prop="">
          <el-date-picker v-model="addForm.time" type="datetime" placeholder="选择发送日期时间" align="left" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
				<el-form-item label="内容" prop="content">
					<el-input class="titleInput" type="textarea" v-model="addForm.content" :autosize="{ minRows: 6, maxRows: 6}"></el-input>
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
	import { getEmail, removeEmail, editEmail, addEmail, getAllUser } from '../../api/api';

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
          title: [
            { required: true, message: '邮件标题不能为空', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '发送时间不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入发送内容', trigger: 'blur' }
          ]
				},
				//编辑界面数据
				editForm: {
          inputValue: '',
          from: '',
          title: '',
          content: '',
          time: '',
          acceptTags:  []
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '邮件标题不能为空', trigger: 'blur' }
					],
          time: [
            { required: true, message: '发送时间不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入发送内容', trigger: 'blur' }
          ]
				},
        // 时间选择器的快捷键
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
				//新增界面数据
				addForm: {
          inputValue: '',
          from: '',
          title: '',
          content: '',
          time: '',
          acceptTags:  []
				},
				allUsers: [],
				state1: ''
			}
		},
		methods: {
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
						self.$message({message: res.errMsg, type: 'error'});
					}else{
						this.total = res.length;
						console.log(res);
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
							item.formatTime = resultStr;
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
      findEmail: function () {
        let self = this;
        if (self.searchStr) {
          // 先获取所有邮件然后在前端做检索
          let callback = function () {
            let currentEmails = self.emails.filter(function (item, index, array) {
              //标志位，用来标志是不是需要设置item.isShow = false，如果经历foreach循环没有被设置为false，就认为这不小说不是搜索的结果
              let isNeedtoChage = true;
              //查询邮件title
              if (item.title.indexOf(self.searchStr) >= 0) {
                item.title = self.findAndSigned(self.searchStr, item.title);
                //设置这本小说在搜索之后会显示
                return true
              }
              //查询邮件内容
              if (item.content.indexOf(self.searchStr) >= 0) {
                item.content = self.findAndSigned(self.searchStr, item.content);
                return true
              }
              // 查询发布人名字
              if (item.from.username.indexOf(self.searchStr) >= 0) {
                item.from.isSearch = true;
                return true
              }
              // 查询接受人名字
              if (item.to.username.indexOf(self.searchStr) >= 0) {
                item.to.isSearch = true;
                return true
              }
              // 查询接受人昵称
              if (item.to.nickname.indexOf(self.searchStr) >= 0) {
                item.to.isSearch = true;
                return true
              }
              return false;
            });
            self.emails = currentEmails;
          };
          self.getEmails(callback);
        } else {
          self.getEmails();
        }
      },
			findAndSigned: function (searchString, readyToBeSearch) {
				if (typeof searchString === 'string') {
					let regExp = new RegExp(searchString, 'igm');
					let leftStr = ''; //记录关键词左边的字符串
					let rightStr = ''; //记录关键词右边的字符串
					let count = 0; //计数器
					let tempStr = readyToBeSearch; //用于正则匹配的字符串
					let notChageStr = readyToBeSearch; //用于截取字符串，和上面一样的值是因为不能把一个值既用于正则运算又用于记录加入<code></code>的新的字符串,这样会使得循环变成无限循环
					let lastIndex = 0; //记录关键词的位置
					while (regExp.exec(tempStr) !== null) {
						lastIndex = regExp.lastIndex + 48 * (count - 1); //每次循环notChageStr并非不变，而是多了<code></code>共计13个字符，所以为了保证后续循环中lastindex的正确性应该将lastindex自增13
						leftStr = notChageStr.substring(0, lastIndex - searchString.length);
						rightStr = notChageStr.substring(lastIndex);
						notChageStr = leftStr + '<span style="background-color: #dc6262;">' + searchString + '</span>' + rightStr;
					}
					return notChageStr;
				} else {
					console.log('The param of findAndSigned is error!....');
					return '';
				}
			},
			//删除
			handleDel: function (index, row) {
				let self = this;
				self.$confirm('确认删除该邮件吗?', '提示', {
					type: 'warning'
				}).then(() => {
					self.listLoading = true;
					//NProgress.start();
					let para = { userid: row.from.userid ,emailid: row.emailid };
					removeEmail(para).then((res) => {
						self.listLoading = false;
						//NProgress.done();
						self.$message({message: '删除成功', type: 'success'});
						self.getEmails();
					}).catch(err => {
            self.$message({message: '删除失败'+err, type: 'error'});
          });
				}).catch(function(err){
					console.log(err);
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
        let self = this;
        self.editFormVisible = true;
        self.editForm = {
          inputValue: '',
          from: '',
          title: row.title,
          content: row.content,
          time: row.time,
          acceptTags: []
				};
        // 更新acceptTags
        let oneTag = {};
        oneTag.userid = row.to.userid;
        oneTag.type = 'primary';
        oneTag.name = row.to.username+'('+row.to.nickname+')';
        self.editForm.acceptTags.push(oneTag);
        self.editForm.emailid = row.emailid;
        self.editForm.adminUserId = row.from.userid;
      },
			//显示新增界面
			handleAdd: function () {
				let self = this;
				self.addFormVisible = true;
				self.addForm = {
					inputValue: '',
					from: '',
          title: '',
          content: '',
          time: '',
					acceptTags:  [],
				};
			},
			//编辑
			editSubmit: function () {
        let self = this;
        self.$refs.editForm.validate((valid) => {
					if (valid) {
            self.$confirm('确认提交吗？', '提示', {}).then(() => {
              self.editLoading = true;
							//NProgress.start();
              let para = {};
              let adminUserId =
              para.title = self.editForm.title || '';
              para.content = self.editForm.content || '';
              para.time = (!self.editForm.time || self.editForm.time === '') ? formatDate.format(new Date(), 'yyyy-MM-dd') : self.editForm.time;
							editEmail(self.editForm.adminUserId, self.editForm.emailid, para).then((res) => {
                self.editLoading = false;
								//NProgress.done();
                self.$message({message: '修改成功', type: 'success'});
                self.$refs['editForm'].resetFields();
                self.editFormVisible = false;
                self.getEmails();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
        let self = this;
        self.$refs.addForm.validate((valid) => {
					if (valid) {
            self.$confirm('确认提交吗？', '提示', {}).then(() => {
              if (self.addForm.acceptTags.length > 0){
                let adminUserId = localStorage.getItem('userid');
                if(adminUserId){
                  self.addForm.acceptTags.forEach(item => {
                    self.addLoading = true;
                    //NProgress.start();
                    let para = {};
                    para.title = self.addForm.title || '';
                    para.content = self.addForm.content || '';
                    para.time = (!self.addForm.time || self.addForm.time === '') ? formatDate.format(new Date(), 'yyyy-MM-dd') : self.addForm.time;
                    addEmail(item.userid, adminUserId, para).then((res) => {
                      self.addLoading = false;
                      //NProgress.done();
                      self.$message({message: '邮件新增成功', type: 'success'});
                      self.$refs['addForm'].resetFields();
                      self.addFormVisible = false;
                      self.getEmails();
                    });
                  });
                }else{
                  self.$message({message: '您尚未登陆，请先登录...', type: 'error'});
                  self.$router.push({ path: '/login' });
                }
              } else {
                self.$message({message: '邮件接收人为空', type: 'error'});
                return false;
              }
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
        let self = this;
        self.$confirm('确认删除选中邮件吗？', '提示', {
          type: 'warning'
        }).then(() => {
          self.listLoading = true;
          //NProgress.start();
          self.sels.forEach(item => {
            let para = { userid: item.from.userid ,emailid: item.emailid };
            removeEmail(para).then((res) => {
              self.listLoading = false;
              //NProgress.done();
              self.$message({message: '删除成功', type: 'success'});
              self.getEmails();
            });
          });
        });
        self.sels.forEach(item => {
            let emailId = item.from.userid;

        });
				let ids = self.sels.map(item => item.emailid).toString();
				alert(this.sels);
        self.$confirm('确认删除选中邮件吗？', '提示', {
					type: 'warning'
				}).then(() => {
          self.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
            self.listLoading = false;
						//NProgress.done();
            self.$message({message: '删除成功', type: 'success'});
            self.getEmails();
					});
				}).catch(err => {
          console.log(err);
          self.$message({message: '删除失败', type: 'success'});
				});
			},
			getAllUsers: function(){
				let self = this;
				getAllUser().then(function(res){
					if(res.code === 0){
						self.allUsers = res.data;
					}else{
						self.$message({message: res.errMsg, type: 'error'});
					}
				}).catch(function(err){
					self.$message({message: '获取可选用户列表错误', type: 'error'});
				})
			},
			handleUserSelect: function(item){
				// 增加acceptTags
				let self = this;
				let isEditOrAdd = null;
				if(self.editFormVisible){
          isEditOrAdd = 'editForm';
        }else if(self.addFormVisible){
          isEditOrAdd = 'addForm';
        }
				let hasBeenAdd = self[isEditOrAdd].acceptTags.some(acceptTagsItem => {
					return item.userid === acceptTagsItem.userid;
				});
				if(!hasBeenAdd){
					self[isEditOrAdd].acceptTags.push({ name: item.username + ' (' + item.nickname + ')', type: 'primary', userid: item.userid });
				}
			},
			// 处理新增页面点击删除按钮的事件
			handleCloseClick: function(item){
				let self = this;
        let isEditOrAdd = null;
        if(self.editFormVisible){
          isEditOrAdd = 'editForm';
        }else if(self.addFormVisible){
          isEditOrAdd = 'addForm';
        }
				if(self[isEditOrAdd].inputValue){
					self[isEditOrAdd].inputValue = '';
				}
			},
			// 处理新增页面标签的点击事件
			handleTagClose: function(tag){
				let self = this;
				let currentIndex = -1;
        let isEditOrAdd = null;
        if(self.editFormVisible){
          isEditOrAdd = 'editForm';
        }else if(self.addFormVisible){
          isEditOrAdd = 'addForm';
        }
				self[isEditOrAdd].acceptTags.forEach((item, index) => {
					if(item.userid === tag.userid){
						currentIndex = index;
					}
				});
				if(currentIndex >= 0){
					self[isEditOrAdd].acceptTags.splice(currentIndex, 1);
				}
			},
			addAutoComplete: function(queryString, cb){
				let allUsers = this.allUsers;
        let results = queryString ? allUsers.filter(this.createFilter(queryString)) : allUsers;
				// 调整result的格式
				results.forEach(item => {
						item.value = item.username+' ('+item.nickname+')';
				});
				results.push({value: 'allUser (所有人)', userid: 'all', username: 'allUser', nickname: '所有人'});
        // 调用 callback 返回建议列表的数据
				if(typeof cb === 'function'){
        	cb(results);
				}
			},
			createFilter(queryString) {
        return (allUsers) => {
          return (allUsers.username.indexOf(queryString) === 0 || allUsers.nickname.indexOf(queryString) === 0);
        };
      }
		},
		mounted() {
			let self = this;
			// 获取userid
			self.userId = localStorage.getItem('userid');
			self.getEmails();
      // 获取所有的用户
      self.getAllUsers();
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
	.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
	.demo-table-expand .full-width{
		width: 100%;
	}
	.el-tag{
		margin-right: 10px;
	}
	.userTags{
		min-height: 36px;
	}
  .titleInput{
    width: 80%;
  }
</style>
