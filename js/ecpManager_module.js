/**
 * Created by mrwater on 16/6/11.
 */
$(document).ready(function(){
    var level_one_setOffX = 0;
    var level_two_setOffX = 0;
    var level_three_setOffX = 0;
    var index = 0;
    //获取要轮播的图片的width宽度
    var width = $(".u-size3of4").width();
    var height = $(".level_one_obj").height() + 50;
    $("#level_one_lunbo").css("height",280);
    $("#level_two_lunbo").css("height",280);
    $("#level_three_lunbo").css("height",280);
    $(".level_one_obj").css("width",width);
    $(".u-size3of4").css("height",280);

    /*上一个面板*/
    $(".level_one_last_btn").bind('click',function(){
        level_one_setOffX += width;
        $(".level_one-objs").animate({left:level_one_setOffX},'slow');

    });
    /*下一个面板*/
    $(".level_one_next_btn").bind('click',function(){
        level_one_setOffX -= width;
        $(".level_one-objs").animate({left:level_one_setOffX},'slow');
    });

    $(".level_two_last_btn").bind('click',function(){
        level_two_setOffX += width;
        $(".level_two-objs").animate({left:level_two_setOffX},'slow');

    });
    $(".level_two_next_btn").bind('click',function(){
        level_two_setOffX -= width;
        $(".level_two-objs").animate({left:level_two_setOffX},'slow');
    });

    $(".level_three_last_btn").bind('click',function(){
        level_three_setOffX += width;
        $(".level_three-objs").animate({left:level_three_setOffX},'slow');

    });
    $(".level_three_next_btn").bind('click',function(){
        level_three_setOffX -= width;
        $(".level_three-objs").animate({left:level_three_setOffX},'slow');
    });
});