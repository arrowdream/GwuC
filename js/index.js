$(function() {
	var $allCheckbox = $('input[type="checkbox"]'), //全部checkbox
	    $wholeCheckbox = $('.whole_check'), 
	    $cartBox = $('.cartBox'),                   //每个商铺的盒子
        $shopCheckbox = $('.shopChoice'),
	    $sonCheckBox = $('.son_check');              //每个商铺下的商品的checkbox


    //为checkbox添加选中未选中状态
	$allCheckbox.click(function() {
		if ($(this).is(":checked")) {
			$(this).next("label").addClass('mark');
		}else{
			$(this).next("label").removeClass('mark');
		}
	});

    //=================全局全选与单个商品的关系===============
    $wholeCheckbox.click(function () {
        var $checkboxs = $cartBox.find('input[type="checkbox"]');
        if ($(this).is(':checked')) {
            $checkboxs.prop("checked", true);
            $checkboxs.next('label').addClass('mark');
        } else {
            $checkboxs.prop("checked", false);
            $checkboxs.next('label').removeClass('mark');
        }
        totalMoney();
    });

    $sonCheckBox.each(function() {
    	$(this).click(function() {
    		if($(this).is(':checked')){
    			//判断：所有单个商品是否勾选
                var len = $('.son_check').length;
                var num = 0;
				$('.son_check').each(function() {
					if($(this).is(':checked')) {
						num++;
					}
					if(num == len) {
						$wholeCheckbox.prop('checked',true);
						$wholeCheckbox.next('label').addClass('mark');
					}
				});
    		}else{
    			//单个商品取消勾选，全局全选取消勾选
    			$wholeCheckbox.prop('checked',false);
    			$wholeCheckbox.next('label').removeClass('mark');
    		}
        totalMoney();
    	})
    });


    //============================每个商铺checkbox与全选checkbox的关系/每个商铺与其下商品样式的变化===============================================
   
    $shopCheckbox.each(function() {
    	$(this).click(function() {
    		if($(this).is(':checked')) {
    			var len = $('.shopChoice').length;
    			var num = 0;
				$('.shopChoice').each(function() {
					if ($(this).is(':checked')) {
						num++;
					}
				});
				if (num == len) {
					$wholeCheckbox.prop('checked',true);
					$wholeCheckbox.next('label').addClass('mark');
				}
				//店铺下的checkbox选中状态
				$(this).parents('.cartBox').find('.son_check').prop("checked", true);
				$(this).parents('.cartBox').find('.son_check').next('label').addClass('mark');


    		}else{
    			//否则，全局全选按钮取消勾选
    			$wholeCheckbox.prop('checked', false);
    			$wholeCheckbox.next('label').removeClass('mark');

    			 //店铺下的checkbox选中状态
                $(this).parents('.cartBox').find('.son_check').prop("checked", false);
                $(this).parents('.cartBox').find('.son_check').next('label').removeClass('mark');

    		}
            totalMoney();
    	});
    });

    //==================每个商铺checkbox与其下商品的checkbox的关系======================

    $cartBox.each(function() {
    	var $this = $(this);
    	$this.find('.son_check').each(function() {
    		$(this).click(function() {
    			if($(this).is(':checked')){
    				//判断：如果所有的$sonChecks都选中则店铺全选勾选
    				var len = $this.find('.son_check').length;
    				var num = 0;
    				$this.find('.son_check').each(function() {
    					if($(this).is(':checked')){
    						num++;
    					}
    				});
    				if(num == len) {
    					$(this).parents('.cartBox').find('.shopChoice').prop("checked",true);
    					$(this).parents('.cartBox').find('.shopChoice').next('label').addClass('mark');
    				}
    			}else{
    				//否则，商铺全选取消
    				$(this).parents('.cartBox').find('.shopChoice').prop("checked",false);
    				$(this).parents('.cartBox').find('.shopChoice').next('label').removeClass('mark');
    			}
                totalMoney();
    		});
    	});
    });

    //===============================商品数量=============================
    var $plus = $('.plus'),
        $reduce = $('.reduce'),
        $all_sum = $('.sum');
    $plus.click(function() {
    	var $inputVal = $(this).prev('input'),
    	    $count = parseInt($inputVal.val())+1,
    	    $obj = $(this).parents('.amount_box').find('.reduce'),
    	    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
    	    $price = $(this).parents('.order_lists').find('.price').html(),
    	    $priceTotal = $count*parseInt($price.substring(1));
    	$inputVal.val($count);
    	$priceTotalObj.html('￥'+ $priceTotal);
    	if($inputVal.val()>1 && $obj.hasClass('reSty')){
    		$obj.removeClass('reSty');
    	}
        totalMoney();
    });

    $reduce.click(function() {
    	var $inputVal = $(this).next('input'),
    	    $count = parseInt($inputVal.val()) - 1,
    	    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
    	    $price = $(this).parents('.order_lists').find('.price').html(),
    	   $priceTotal = $count * parseInt($price.substring(1));

    	if($inputVal.val() > 1){
    		$inputVal.val($count);
    		$priceTotalObj.html('￥'+$priceTotal);
    	}
    	if ($inputVal.val() == 1 && !$(this).hasClass('reSty')) {
            $(this).addClass('reSty');
    	}
        totalMoney();
    });


    $all_sum.keyup(function() {
    	var $count = 0,
    	    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
    	    $obj = $(this).parents('.amount_box').find('.reduce'),
    	    $price = $(this).parents('.order_lists').find('.price').html(),
    	    $priceTotal = $count * parseInt($price.substring(1));

    	$(this).val($(this).val().replace(/\D|^0/g,''));
    	if ($(this).val()=='') {
    		$(this).val(1);
    	}
    	
        $count = $(this).val();
        if($count>1 && $obj.hasClass('reSty')){
    		$obj.removeClass('reSty');
    	}
    	if ($count==1 && !$obj.hasClass('reSty')) {
    		$obj.addClass('reSty');
    	}
        $priceTotal = $count*parseInt($price.substring(1));
        $(this).attr('value',$count);
        $priceTotalObj.html('￥'+$priceTotal);
        totalMoney();
    }); 

//===============================移除商品=================================
    var $order_lists = null,
        $order_content = null;
    $('.list_op .delBtn').click(function() {
    	$order_lists = $(this).parents('.order_lists');
    	$order_content = $(this).parents('.cartBox');

    	$(".my_model").fadeIn('200');
    	$(".model_bg").fadeIn('200');
    });
    
    $('.closeModel').click(function() {
    	closeM();
    });

    $('.dialog-close').click(function() {
    	closeM();
    });

    $('.dialog-sure').click(function() {
        $order_lists.remove();
        var $listlen =  $order_content.find('.order_lists').length;
        if($listlen == 0){
        	$order_content.remove();
        }
        closeM();
        totalMoney();
    });

    function closeM() {
    	$('.my_model').fadeOut('100');
    	$('.model_bg').fadeOut('100');
    };

    function totalMoney() {
        var $pieceSumObj = $('.piece_num'),
        $totalTextObj = $('.total_text'),
        $pieceSum = 0,
        $totalText =0;
        
        var $sum = $('.sum');

        $('.son_check').each(function() {
            if ($(this).is(":checked")) {
                var $thisPiece = parseInt($(this).parents('.order_lists').find('.sum').val()),
                    $thisSum = parseInt($(this).parents('.order_lists').find('.sum_price').html().substring(1));
                $pieceSum += $thisPiece;
                $totalText += $thisSum;
            }
        });

        $pieceSumObj.html($pieceSum);
        $totalTextObj.html("￥"+$totalText);
        
        if ($pieceSum!=0 || $totalText!=0) {
            if (!$('.calBtn a').hasClass('btn_sty')) {
                $('.calBtn a').addClass('btn_sty');
            }
        }else{
            if ($('.calBtn a').hasClass('btn_sty')) {
                $('.calBtn a').removeClass('btn_sty');
            }
        }
    }
})