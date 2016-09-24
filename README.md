# Running Man 节目记录

![](http://cdn.saymagic.cn/o_1atduetlk17861ll51tvh30616or9.png)

![](http://cdn.saymagic.cn/o_1atduj3vel407231u1c1nvu3oce.png)

![](http://cdn.saymagic.cn/o_1ate0d9t52vivcnut2j861obb9.png)

## 背景介绍

偶然看了韩国很火的综艺的综艺节目《Running man》的鬼姐妹特辑，觉得情节设计很棒，想找几期经典的来看。网上推荐精彩期数的作者不同，推荐的内容格式不大一样，整理起来比较麻烦，所以做成了比较直观的表格，可以注册登录录入自己个性化的意向期数。

## 项目介绍

新用户注册后自动录入一条示例数据。

可以新增/修改/删除条目。

新增条目默认按时间排序。


## 使用说明

用户需注册才能使用，暂未提供密码找回功能，所以需要牢记密码。

注册/登录后自动跳转到主界面，可以在右上角新增数据，或者在某行上进行修改或删除。

每页默认线束8条数据，可通过页码标签进行分页跳转。

## 开发依赖

### 后端

后端使用 Bmob，想实现自己项目的同学可以申请自己的账号进行开发。

<pre>
Bmob.initialize("YourApplicationId", "RestId");
</pre>

### 前端

* Jquery 2.2.4

* Bootstrap 3.3.5

## TODO

* 自定义分页

* 表格内容缩略显示

## 开发

0-0-9 ，[博客： Wendy's Blog](http://blog.ilanyy.com/)

## License

   Copyright 2016 Wendy

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
