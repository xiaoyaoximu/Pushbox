$(function(){
	game.init($("#div1"))//游戏开始 
})
//初始化的封装函数
var game={
	gamegk:[   //游戏关卡数据
		{
			map:[
				2,2,2,2,2,2,2,2,
				2,4,4,2,4,4,4,2,
				2,4,4,3,3,4,4,2,
				2,4,4,3,4,4,2,2,
				2,4,4,3,3,4,4,2,
				2,4,4,2,4,4,4,2,
				2,2,2,2,2,2,2,2,
				1,1,1,1,1,1,1,1
			],
			box:[
				{x:2,y:2},
				{x:5,y:2},
				{x:2,y:3},
				{x:2,y:4},
				{x:5,y:4},
			],
			person:{x:1,y:3}
				
		},
		
		{
			map:[
				1,1,2,2,2,2,1,1,
				1,1,2,3,3,2,1,1,
				1,2,2,4,3,2,2,1,
				1,2,4,4,4,3,2,1,
				2,2,4,4,4,4,2,2,
				2,4,4,2,4,4,4,2,
				2,4,4,4,4,4,4,2,
				2,2,2,2,2,2,2,2  
			],
			box:[
				{x:4,y:3},
				{x:3,y:4},
				{x:4,y:5},
				{x:5,y:5}
			],
			person:{x:3,y:6}
				
			
		},
		{
			map:[
				1,2,2,2,2,2,2,1,
				1,2,4,4,4,4,2,2,
				2,2,3,2,2,4,4,2,
				2,4,3,3,4,4,4,2,
				2,4,4,2,4,4,4,2,
				2,4,4,4,4,2,2,2,
				2,2,2,2,2,2,1,1,
				1,1,1,1,1,1,1,1
				  
			],
			box:[
				{x:5,y:2},
				{x:4,y:3},
				{x:4,y:4}
				
			],
			person:{x:3,y:5}
				
			
		}
	],
	num:0,//游戏关卡数
	init:function(parent){
		this.parent=parent;
		this.createMap(0);//传入关卡数
		
	},
	//创建地图
	createMap:function(gknum){
			this.parent.empty();
			document.title='第'+(gknum+1)+'关'
		this.nowJson=this.gamegk[gknum];
		this.parent.css("width",Math.sqrt(this.nowJson.map.length)*50)
		 $.each(this.nowJson.map, $.proxy(function(i,elem){//获取关卡的地图数组
		 	this.parent.append('<div class="map'+elem+'"></div>');
		 },this));
		 this.fillBox();
		 this.fillPerson();
	},
	//填充箱子
	fillBox:function(){
		$.each(this.nowJson.box,$.proxy(function(i,elem){
			var oBox=$('<div class="box"></div>')
			oBox.css("left",elem.x*50);
			oBox.css("top",elem.y*50);
			this.parent.append(oBox);
		},this))
	},
	//填充人物
	fillPerson:function(){
		/*$.each(this.nowJson.person,$.proxy(function(i,elem){*/
			var oPerson=$('<div class="per"></div>');
			oPerson.css("left",this.nowJson.person.x*50);
			oPerson.css("top",this.nowJson.person.y*50);
			oPerson.data("x",this.nowJson.person.x);
			oPerson.data("y",this.nowJson.person.y);
			this.parent.append(oPerson);
			this.contorlPerson(oPerson);
		/*},this))*/
		
	},
	//控制人物，对人物进行键盘控制
	contorlPerson:function(oP){
		$(document).keydown($.proxy(function(ev){//给文档添加键盘事件
			switch(ev.which){
				case 37://左键 
				oP.css('backgroundPosition','-150px 0');
				this.runPerson(oP,{x:-1})
				break;
				case 38://上键
				oP.css('backgroundPosition','0 0');
				this.runPerson(oP,{y:-1})
				
				break;
				case 39://右键
				oP.css('backgroundPosition','-50px 0');
				this.runPerson(oP,{x:1})
				break;
				case 40://下键
				oP.css('backgroundPosition','-100px 0');
				oP.css('backgroundPosition','0 0');
				this.runPerson(oP,{y:1})
				break;
				
			}
		},this))
	},
	//人物移动
	runPerson:function(oP,opt){
		var stepX=opt.x||0;
		var stepY=opt.y||0;
		if(this.nowJson.map[(oP.data('y')+stepY)*Math.sqrt(this.nowJson.map.length)+(oP.data('x')+stepX)] !=2){
					oP.data('y',oP.data('y')+stepY);
					oP.data('x',oP.data('x')+stepX);
					oP.css("top",oP.data('y')*50);
					oP.css("left",oP.data('x')*50);
					//遍历箱子
					$(".box").each($.proxy(function(i,elem){
						if(this.pushbox(oP,$(elem))&&this.nowJson.map[(oP.data('y')+stepY)*Math.sqrt(this.nowJson.map.length)+(oP.data('x')+stepX)] !=2){
							$(elem).css('left',(oP.data('x')+stepX)*50);
							$(elem).css('top',(oP.data('y')+stepY)*50);
							
							$(".box").each($.proxy(function(j,elem2){//讨论箱子碰到箱子的情况
								 if(this.pushbox($(elem),$(elem2))&&elem!=elem2){
								 	$(elem).css('left',oP.data('x')*50);
									$(elem).css('top',oP.data('y')*50);
									
									oP.data('y',oP.data('y')-stepY);
									oP.data('x',oP.data('x')-stepX);
									oP.css("top",oP.data('y')*50);
									oP.css("left",oP.data('x')*50);
								 }
							},this))
						}else if(this.pushbox(oP,$(elem))){
							oP.data('y',oP.data('y')-stepY);
							oP.data('x',oP.data('x')-stepX);
							oP.css("top",oP.data('y')*50);
							oP.css("left",oP.data('x')*50);
						}
						
					},this))
			}
		
		this.nextShow();
		
	},
	//人物与箱子碰撞(人物推箱子)
	pushbox:function(obj1,obj2){
		var L1=obj1.offset().left;
		var R1=obj1.offset().left+obj1.width();
		var T1=obj1.offset().top;
		var B1=obj1.offset().top+obj1.height();
		
		var L2=obj2.offset().left;
		var R2=obj2.offset().left+obj2.width();
		var T2=obj2.offset().top;
		var B2=obj2.offset().top+obj2.height();
		
		if(L1>=R2||R1<=L2||B1<=T2||T1>=B2){
			return false;//没有碰撞上返回false；
		}else{
			return true;//碰撞上返回true；
		}
	},
	//下一关
	nextShow:function(){
		
		var iNow=0;
		$(".map3").each($.proxy(function(i,elem){
				$(".box").each($.proxy(function(j,elem2){
					if(this.pushbox($(elem),$(elem2))){
						iNow++;
					}
				},this));
		},this));
		if(iNow==$(".box").size()){
		   this.createMap(1)
		}
	}
}





























