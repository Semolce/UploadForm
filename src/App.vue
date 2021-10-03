<template>

<div>
 
  <div class = "urlInput" style="width: 60%">
    <el-input v-model="videoUrl" placeholder="Please enter video ID|Sample input:L77ujOmwe1E"></el-input>
  </div>

  <div class = "urlInput" style="width: 60%">
    <el-input v-model="SegInfo" placeholder="Sample input:0:00-0:30;0:30-1:52; or 0000-0030;0030-0152;"></el-input>
    <el-button @click="generateSeg" >Initialization</el-button>
  </div>

  <div class="table">
    <!-- <el-button @click="change">测试按钮</el-button> -->
    <el-table
            :data="tableData"
            class="tb-edit"
            style="width: 100%">

        <el-table-column  v-for="(item,index) in tableHead" :key="index" :label="item.label" :property="item.property" width="200" align="center" >
            <template v-slot="scope">
                <el-input v-model="scope.row[scope.column.property]" ></el-input>     
            </template>
        </el-table-column>

        <el-table-column  :label="timeHead.label" :property="timeHead.property" width="200" align="center" >
            <template v-slot="scope">
                <el-input v-model="timeValue[scope.$index]" placeholder="Please end with ;"></el-input>     
            </template>
        </el-table-column>




        <!-- <el-table-column :label="MetaTypeTitle" width="180">
          <template v-slot="scope1">
                <el-select v-model="scope1.row[scope1.column.property]" placeholder="Please Select MetaType" @change="changeMetaType($event,scope1.$index)">
                    <el-option
                      v-for="item in MetaType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
          </template>    
        </el-table-column> -->

        <el-table-column :label="MetaTypeTitle" width="120" align="center" >
          <template v-slot="scope1">
                <el-select v-model="TypeValue[scope1.$index]" placeholder="Select MetaType" @change="changeMetaType($event,scope1.$index)" >
                    <el-option
                      v-for="item in MetaType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
          </template>    
        </el-table-column>

        <!-- <el-table-column :label="SegmentTitle" width="180" align="center" >
            <template v-slot="scope2">
                <el-select v-model="SegValue[scope2.$index]" placeholder="Select Segment" @change="changeSegValue($event,scope2.$index)">
                    <el-option
                      v-for="item in Segments"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                </el-select>
            </template>    
        </el-table-column> -->

        <el-table-column :label="SegmentTitle" width="450" align="center" >
            <template v-slot="scope2">
                <!-- <el-checkbox-group  v-model="SegValue[scope2.$index]" size="mini" > -->
                    <el-checkbox v-for="seg in Segments"  :label="seg" :key="seg" @change="changeSegValue($event,scope2.$index,seg)">{{seg}}</el-checkbox>
                <!-- </el-checkbox-group> -->
            </template>    
        </el-table-column>
        
         <el-table-column label="NonBbox" width="150">
              <template v-slot="scope3">
                  <el-upload  action="" accept="image/jpeg,image/png"
                    :on-remove="removeImg"
                    :on-change="onUploadChange"
                    :auto-upload="false"
                    :show-file-list="true"
                    >
                      <el-button size="small" type="primary" @click="setrow(scope3.$index)">upload img</el-button>
                  </el-upload>
              </template>
          </el-table-column>

          <el-table-column label="Bbox" width="150">
              <template v-slot="scope4">
                  <el-upload  action="" accept="image/jpeg,image/png"
                    :on-remove="removeImg1"
                    :on-change="onUploadChange1"
                    :auto-upload="false"
                    :show-file-list="true"
                    >
                      <el-button size="small" type="primary" @click="setrow1(scope4.$index)">upload img</el-button>
                  </el-upload>
              </template>
          </el-table-column>

        <el-table-column label="Operation" align="center" width="180">
            <template v-slot="scope">
                <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">ADD</el-button>
                <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">DELETE</el-button>
            </template>
        </el-table-column>

    </el-table>
  </div>

  <div class = 'upload'>
    <el-button @click="upload">Upload</el-button>
    <el-button @click="uploadImg">Save Images</el-button>
    <el-button @click="uploadOriginalInfo">Upload Original Info</el-button>
  </div>

</div>


</template>

<script>

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
const FileSaver = require('./components/file-saver')
var JSZip = require("jszip");
import {AIMarker} from './components/ui-picture-bd-marker'
// import dynamicTable from "./components/dynamicTable.vue"

// import ElementUI from "../node_modules/element-ui/types/index"
// import 'element-ui/lib/theme-chalk/index.css';
// import Slider from './components/slider.vue';
// import { Table, TableColumn } from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

export default {
        components: {
        ElementPlus,
        FileSaver,
        JSZip,
        'ui-marker':AIMarker
        // Slider,
        //elTable: Table,
        //elTableColumn: TableColumn
        },
        

        data() {
            return {
                // 视频参数
                
                count_col:0,
                showMenu:false,
                curColumn:null,

                // 表头
                tableHead:[
                    {label:'Question',
                    property:'Question'
                    },
                    {label:"Reason",
                    property:"Reason"}
                    ],

                tableHead1:{
                  label:'Question',
                  property:'Question'
                },
                // tableHead:[
                //     {label:'Question',
                //     property:'Question'
                //     }
                //     ],
                
                  // 数据值
                  tableData: [
                      {Question: 'What is...',
                      Reason:'Reason1'
                      },
                      {Question: 'How is...',
                      Reason:'Reason2'
                      },],

                  timeHead:{label:'Start-End',
                  property:'Start-End'},
                  timeValue:[[],[]],

                  //下拉框值
                  MetaType:[{
                    value:'Text Only',
                    label:'Text Only'
                  },
                  {
                    value:'Video Only',
                    label:'Video Only'
                  },
                  {
                    value:'Text and Video',
                    label:'Text and Video'
                  }],
                  MetaTypeTitle:"Query Type",
                  // TypeValue:[
                  //   {value:'Text Only'},
                  //   {value:'Video only'}]
                  TypeValue:["",""],

                  SegInfo:[],
                  SegNum:[],
                  Segments:[],
                  SegValue:[[],[]],
                  SegmentTitle:"Segment",

                  progressLength:710,
                  
                  videoUrl:[],

                  currentRow : [],

                  imgList:[[],[]],

                  img_base64:[],
                  img_file:[],

                  storePath:'/imgStore',

                  bboxList:[[],[]],

                  bbox_base64:[],
                  bbox_file:[],

            }  
        },

        computed: {
            player() {
                return this.$refs.videoPlayer.player
            },
            setProgressBgStyle () {
                return {
                    // 加上滑块的宽度
                    width: `${this.width + this.sliderWidth}px`
                }
            },
            setProgressStyle () {
                return {
                    width: `${this.progressWidth}px`,
                    // background: color
                }
            },

        },

        methods:{
            
            generateSeg(){
              console.log(this.SegInfo);
              
              this.Segments=[];
              // for(var i=1;i<=parseInt(this.SegNum);i++){
              //   this.Segments.push('Seg'+i)
              // }
              // console.log(this.Segments)
              var i=0; 
              var counter=0;
              var counter1=0;
              while (true){
                i=this.SegInfo.indexOf(';',i);
                if (i<0)
                  break
                console.log(this.SegInfo.indexOf(';',i))
                counter++;
                i=i+1;
              }

              i=0;

              while (true){
                i=this.SegInfo.indexOf('-',i);
                if (i<0)
                  break
                console.log(this.SegInfo.indexOf('-',i))
                counter1++;
                i++;
              }

              if (counter1==counter){
                for(var i=1;i<=counter;i++){
                this.Segments.push('Seg'+i)
              }
              }
              else{
                alert('Lack of - or ;')
              }
              this.checkSegInput(this.SegInfo)
            },
            
            checkSegInput(seginfo){
              if(seginfo.indexOf(" ")>0){
                alert('Space in input!Please delete all spaces')
              }
              var left=seginfo.indexOf('-');
              var right=seginfo.indexOf(';');
              while (right>0&right<seginfo.length-1){
                var a=seginfo.substring(left+1,right);
                var b=seginfo.substring(right+1,right+1+a.length);
                console.log(a)
                console.log(b)
                if (a!=b){
                  alert('Interval between segments!')
                }
                left=seginfo.indexOf('-',left+1);
                right=seginfo.indexOf(';',right+1)
              }

            },

            handleEdit(index, row) {
                this.tableData.splice(index+1,0,{Question: '',
                      Reason:''
                      }),
                this.TypeValue.splice(index+1,0,""),
                this.SegValue.splice(index+1,0,[]),
                this.imgList.splice(index+1,0,[]),
                this.bboxList.splice(index+1,0,[]),
                this.timeValue.splice(index+1,0,[]),
                console.log(this.imgList)
            },
            handleDelete(index, row) {
                this.tableData.splice(index,1),
                this.TypeValue.splice(index,1),
                this.SegValue.splice(index,1),
                this.imgList.splice(index,1),
                this.timeValue.splice(index,1),
                this.bboxList.splice(index,1)
                // console.log(index);
            },
            changeMetaType(event,row){
              //this.TypeValue=this.MetaType[obj].value
              // const { value, label } = params;
		          this.TypeValue[row] = event;
              console.log(this.TypeValue[row])
            },
            changeSegValue(event,index,seg){            
              if (event)
              { 
                console.log(event)
                console.log(index)
                console.log(seg)
                var temp = this.SegValue[index];
                var flag = 0
                for (var i=0;i<temp.length;i++)
                {
                  if (temp[i]===seg)
                  {
                    flag = 1;
                    break
                  }
                }
                if (flag==0)
                {
                  this.SegValue[index].push(parseInt(seg.substring(3)))
                }             
              }
              else
              {
                var temp = this.SegValue[index];
                for (var i=0;i<temp.length;i++)
                {
                  if (temp[i]===seg)
                  {
                    break
                  }
                }
                  this.SegValue[index].splice(i,1)                
              }
              console.log(event)
              console.log(this.SegValue)
            },
            ShowIntroduction(){
              this.Introduction = !this.Introduction
            },
            upload(){
              // var fs = require("fs")
              var  QuestionList=[]
              QuestionList.push({videoID:this.videoUrl})
              var seginfo=this.timeProcess(this.SegInfo);
              QuestionList.push({segInfo:seginfo})
              var left;
              var right;
              var Ques;
              var filename;
              var Counter;
              var temp;
              for (var i = 0; i<this.tableData.length;i++)
                { 
                  Ques = this.tableData[i].Question;
                  left = Ques.indexOf('<');
                  right = Ques.indexOf('>');
                  Counter=0;
                  filename=[];
                  var flag = 0;
                  while(left>=0){
                    temp = Ques.substring(left+1,right);
                    console.log(temp)
                    Counter++;

                    if (temp.match('bbox')){
                      var b=temp.match('bbox');
                      b=b["index"];
                      var num=temp.substring(b,b+5);
                      if (num[num.length-1]=='/'){
                        num=num.substring(0,num.length-1)
                      }
                      b=temp.indexOf('/');
                      if (b==-1){
                        alert('lack of / in Q'+i)
                      }
                      var name=temp.substring(b+1,right);
                      Ques=Ques.substring(0,left+1)+
                           num+'/'+name+
                           Ques.substring(right)
                      if (flag==0){
                        filename = this.videoUrl+'_bbox_Q'+i+'.jpg';
                        flag++;
                      }
                      
                    }
                    else{
                      b=temp.indexOf('/');
                      if (b==-1){
                        alert('lack of / in Q'+i)
                      }
                      var name=temp.substring(b+1,right);
                      Ques=Ques.substring(0,left+1)+
                           name+
                           Ques.substring(right)
                      
                      if (flag==0){
                        filename = this.videoUrl+'_img_Q'+i+'.jpg';
                        flag++;
                      }
                    }
                    // if (type == 'i'){
                    //   Ques=Ques.substring(0,left+1)+
                    //                              this.videoUrl+'_img_Q'+i+'_'+num+'.jpg'+
                    //                              Ques.substring(right)
                    // }
                    // if (type == 'b'){
                    //   Ques=Ques.substring(0,left+1)+
                    //                              this.videoUrl+'_bbox_Q'+i+'_'+num+'.jpg'+
                    //                              Ques.substring(right)
                    // }
                    left=0;right=0;
                    for(var j=0;j<=Counter;j++){
                      left = Ques.indexOf('<',left);
                      right = Ques.indexOf('>',right);
                      left++;
                      right++;
                    }
                    left--;right--;
                  }
                  console.log(Ques);

                  var start_endtime=this.obtainStartEndTime(this.timeValue[i])
                  console.log(start_endtime);
                  QuestionList.push({ID:this.videoUrl+'_Q'+i,
                                    Question:Ques, 
                                    Reason:this.tableData[i].Reason, 
                                    QueryType:this.TypeValue[i], 
                                    Segment:this.SegValue[i],
                                    Filename:filename,
                                    Start_EndTime:start_endtime
                                    },
                                    )
                }
                
              console.log(QuestionList)
              // store json file: 
              var data = JSON.stringify(QuestionList)
              var blob = new Blob([data], {type: ''})
              FileSaver.saveAs(blob, this.videoUrl+'.json')
            },

            obtainStartEndTime(timeValue){
              if(timeValue.indexOf(" ")>0){
                alert('Space in start-end!Please delete all spaces')
              }
              if(timeValue[timeValue.length-1]!=';'){
                alert('start-end time must end with ;')
              }
              return this.timeProcess(timeValue)
            },

            timeProcess(timeSequence){
              var left=0;
              var right=timeSequence.indexOf(';');
              var timeslot=[];
              var temp=[];
              var interval;
              var numL;
              var numR;
              while (right>0){
                //temp=timeSequence.substring(left,right);
                interval=timeSequence.indexOf('-',left);
                numL=timeSequence.substring(left,interval);
                numR=timeSequence.substring(interval+1,right)
                if(numL.indexOf(':')>0){
                  numL=parseInt(numL.substring(0,numL.indexOf(':')))*60+parseInt(numL.substring(numL.indexOf(':')+1))
                }
                else if(numL.indexOf('.')>0){
                  numL=parseInt(numL.substring(0,numL.indexOf('.')))*60+parseInt(numL.substring(numL.indexOf('.')+1))
                }
                else {
                  numL=parseInt(numL.substring(0,2))*60+parseInt(numL.substring(2))
                }
                if(numR.indexOf(':')>0){
                  numR=parseInt(numR.substring(0,numR.indexOf(':')))*60+parseInt(numR.substring(numR.indexOf(':')+1))
                }
                else if(numR.indexOf('.')>0){
                  numR=parseInt(numR.substring(0,numR.indexOf('.')))*60+parseInt(numR.substring(numR.indexOf('.')+1))
                }
                else{
                  numR=parseInt(numR.substring(0,2))*60+parseInt(numR.substring(2))
                }

                timeslot.push([numL,numR])
                left=right+1;
                right=timeSequence.indexOf(';',right+1)
                console.log(timeslot)
              }
              return timeslot
            },

            setrow(index){
              this.currentRow = index
              console.log(index)
            },

            setrow1(index){
              this.currentRow = index
              console.log(index)
            },

            addlist(file,filelist){
                      var Len = filelist.length
                      // console.log(file.name)
                      // console.log(this.videoUrl+'_Q'+this.currentRow.toString()+'_'+Len.toString())
                      // console.log(this.img_base64)
                      this.imgList[this.currentRow].push({originalName:file.name,
                                                         fileName:this.videoUrl+'_Q'+this.currentRow.toString(),// add img num at last
                                                         base64Data:this.img_base64
                      })
                      console.log(this.img_base64)
                      // console.log(this.imgList)
                    },

            onUploadChange(file,filelist)
                {  
                  const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png');
                  const isLt1M = file.size / 1024 / 1024 < 1;
                  // console.log(index);
                  if (!isIMAGE) {
                  this.$message.error('只能上传jpg/png图片!');
                  return false;
                  }
                  if (!isLt1M) {
                  this.$message.error('上传文件大小不能超过 2MB!');
                  return false;
                  }
                  // console.log(file)
                  this.img_file = file;
                  var reader = new FileReader();
                  // var img_base64;
                  // reader.readAsDataURL(file.raw);
                  let this_=this
                  reader.onloadend = function(e){                    
                    //return this.result;
                    //urlData = reader.result
                    //console.log(reader.result)
                    //return reader.result
                    this_.img_base64 = reader.result
                    this_.imgList[this_.currentRow].push({originalName:this_.img_file.name,
                                                         fileName:this_.videoUrl+'_img_Q'+this_.currentRow.toString(),// add img num at last
                                                         base64Data:this_.img_base64
                      })
                    //console.log(this_.imgList)
                    //console.log(this_.img_base64)
                  };
                  
                  reader.readAsDataURL(file.raw);
                  //this.sleep(3000)
                  // delay
                  // location.reload()
                  // this.addlist(file,filelist)
                },

                onUploadChange1(file,filelist)
                {  
                  const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png');
                  const isLt1M = file.size / 1024 / 1024 < 1;
                  // console.log(index);
                  if (!isIMAGE) {
                  this.$message.error('只能上传jpg/png图片!');
                  return false;
                  }
                  if (!isLt1M) {
                  this.$message.error('上传文件大小不能超过 2MB!');
                  return false;
                  }
                  // console.log(file)
                  this.bbox_file = file;
                  var reader = new FileReader();
                  // var img_base64;
                  // reader.readAsDataURL(file.raw);
                  let this_=this
                  reader.onloadend = function(e){                    
                    //return this.result;
                    //urlData = reader.result
                    //console.log(reader.result)
                    //return reader.result
                    this_.bbox_base64 = reader.result;
                    this_.bboxList[this_.currentRow].push({originalName:this_.bbox_file.name,
                                                         fileName:this_.videoUrl+'_bbox_Q'+this_.currentRow.toString(),// add img num at last
                                                         base64Data:this_.bbox_base64
                      })
                    console.log(this_.bboxList)
                    //console.log(this_.img_base64)
                  };
                  
                  reader.readAsDataURL(file.raw);
                  //this.sleep(3000)
                  // delay
                  // location.reload()
                  // this.addlist(file,filelist)
                },
                    
                    removeImg(file,filelist){
                      var temp = this.imgList[this.currentRow]
                      for(var i=0;i<temp.length;i++)
                      { 
                        if (temp[i].originalName === file.name)
                        {
                          this.imgList[this.currentRow].splice(i,1)
                          break
                        }
                      }
                      console.log(this.imgList)
                      // console.log(file)
                      // console.log(filelist)
                    },

                    removeImg1(file,filelist){
                      var temp = this.bboxList[this.currentRow]
                      for(var i=0;i<temp.length;i++)
                      { 
                        if (temp[i].originalName === file.name)
                        {
                          this.bboxList[this.currentRow].splice(i,1)
                          break
                        }
                      }
                      console.log(this.bboxList)
                      // console.log(file)
                      // console.log(filelist)
                    },

                downloadFile(fileName, content) {
                  let aLink = document.createElement('a');
                  let blob = this.base64ToBlob(content); //new Blob([content]);
                  console.log(blob);

                  // let evt = document.createEvent("HTMLEvents");
                  // evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                  // aLink.download = fileName+'.jpg';
                  // aLink.href = URL.createObjectURL(blob);
                  // aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));//兼容火狐
                },
 
                base64ToBlob(code) {
                  let contentType = code.split(':')[1];
                  let raw = window.atob(code);
                  let rawLength = raw.length;
                  let uInt8Array = new Uint8Array(rawLength);
                  for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                  }
                return new Blob([uInt8Array], { type: contentType });
                },


                
                uploadImg(){
                  // var base64_img = this.imgList[0][0].base64Data;
                  // var filename = this.imgList[0][0].fileName;
                  // base64_img=base64_img.substring(base64_img.indexOf(',') + 1)
                  // console.log(base64_img);
                  //this.downloadFile(filename,base64_img)

                  var zip = new JSZip();//*****创建实例，zip是对象实例
                  var file_name = this.videoUrl+'.zip';
                  var img_arr;
                  var counter;

                  for(let i=0;i<this.imgList.length;i++){
                    //对每一个图片链接获取base64的数据，并使用回调函数处理
                    for(var j=0;j<this.imgList[i].length;j++){
                      img_arr = this.imgList[i][j].base64Data;
                      img_arr = img_arr.substring(img_arr.indexOf(',') + 1);
                      //console.log(img_arr)
                      counter = j+1;
                      zip.file(this.imgList[i][j].fileName+'.jpg',img_arr,{base64: true});
                      console.log(j)//根据base64数据在压缩包中生成jpg数据
                    }
                  };

                  for(let i=0;i<this.bboxList.length;i++){
                    //对每一个图片链接获取base64的数据，并使用回调函数处理
                    for(var j=0;j<this.bboxList[i].length;j++){
                      img_arr = this.bboxList[i][j].base64Data;
                      img_arr = img_arr.substring(img_arr.indexOf(',') + 1);
                      //console.log(img_arr)
                      counter = j+1;
                      zip.file(this.bboxList[i][j].fileName+'.jpg',img_arr,{base64: true});
                      console.log(j)//根据base64数据在压缩包中生成jpg数据
                    }
                  };

                  console.log(file_name);
                  zip.generateAsync({type:"blob"})
                      .then(function(content) {
                            //console.log(content);
                      saveAs(content, file_name);   
                    })
                },

                uploadOriginalInfo(){
                  // var fs = require("fs")
              var  QuestionList=[]
              QuestionList.push({videoID:this.videoUrl})
              QuestionList.push({segInfo:this.SegInfo})
              for (var i = 0; i<this.tableData.length;i++)
                {   
                  QuestionList.push({ID:this.videoUrl+'_Q'+i,
                                    Question:this.tableData[i].Question, 
                                    Reason:this.tableData[i].Reason, 
                                    QueryType:this.TypeValue[i], 
                                    Segment:this.SegValue[i],
                                    Start_EndTime:this.timeValue[i]
                                    },
                                    )
                }
                
              console.log(QuestionList)
              // store json file: 
              var data = JSON.stringify(QuestionList)
              var blob = new Blob([data], {type: ''})
              FileSaver.saveAs(blob, this.videoUrl+'_original.json')

                }


          }
	
}

    
</script>


<style scoped lang="less">
  .demo{
    display: inline-block;
    width: 900px;
    height: 670px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: rgb(14, 3, 3);
    position: relative;
    // position:absolute;
    left:20%;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
    
  };
</style>


<style scoped lang="less">
  .c-progress {
    width: 900px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    
    span {
      margin-left: 5px;
      font-size: 14px;
      color: #666;
    }
    
    .c-progress-outer {
      width: 724px;
      height: 21px;
      border-radius: 20px;
      background: #8f97a8;
      position: relative;
      left:43.5%;
      //position:absolute;
      display: flex;
      align-items: center;
      margin-top: 10px;
      
      .c-progress-inner {
        width: 920px;
        height: 20px;
        background: #409EFF;
        border-radius: 20px;
      }
    }
  }
</style>

<style scoped>
    .table{
      position: relative;
      margin-top: 10px;
    }
</style>


<style scoped>
  .upload{
    position: relative;
    margin-top: 10px;
  }
</style>


