 
    jQuery(document).ready(function () {   
  
  
	jQuery('#vpc-components').append(jQuery('.vpc-action-buttons'));
	
 menu_hover();
 open_search_cart_menu();
	open_cart_panel();
	replace_link();
 product_filter();
 toggle_products();
 add_sticky_container();
 
 open_first_panel();
 set_order_image();
 configurator_data();
 replace_image_thankyou();
close_coupon_popup();
 language_switcher();

    });
    
    
jQuery(window).scroll(function () {
 

});

  
  function menu_hover() {
   jQuery('.main_nav').find('.menu-item-has-children').hover(
        function() {
            jQuery('.hover_div').addClass( "hover" );
        },
        function() {
            jQuery('.hover_div').removeClass( "hover" );
        }
    );
  }
  
  
  function open_search_cart_menu() {
 jQuery('.searchToggle').click(function(e) {
  		jQuery('.languageBar, .main_nav , .widget_shopping_cart_content, .reviewBar').removeClass('open');
				jQuery('.searchBar').toggleClass('open');
				e.preventDefault();
									
			});
 
  jQuery('.toggle_top_language').click(function(e) {
								jQuery('.searchBar, .main_nav , .widget_shopping_cart_content, .reviewBar').removeClass('open');
         jQuery('.languageBar').toggleClass('open');
								e.preventDefault();
									
			});
  
   jQuery('.toggle_language').click(function() {
    	jQuery('.languageBar').find('ul').removeClass('open');
    
								jQuery(this).parent('ul').toggleClass('open');
									
			});		 
		
		jQuery('.toggle_menu').click(function(e) {
     jQuery('.languageBar, .searchBar, .widget_shopping_cart_content, .reviewBar').removeClass('open');
					jQuery('.main_nav').toggleClass('open');
						e.preventDefault();
			});
  
  
     
           
            jQuery('.main_nav').find(".menu-item-has-children").click(function(e) {
             	width = jQuery(window).width();	
                if (width<1501){
               
                            if(e.target != this ) return;
                            
                             e.preventDefault();
                            jQuery(this).toggleClass('open-submenu');
                         
                       
                  }
            });	
         
	
	
	jQuery('.cart_row').on('click', '.total.item-count', function(e){		
					jQuery('.languageBar, .searchBar, .main_nav, .reviewBar').removeClass('open');
    	jQuery('.widget_shopping_cart_content').toggleClass('open');
			  e.preventDefault();
	});
	
 
 	jQuery('.toggle_reviews').click(function(e) {
   		jQuery('.languageBar, .searchBar, .main_nav , .widget_shopping_cart_content').removeClass('open');
     jQuery('.reviewBar').toggleClass('open');
					 e.preventDefault();           
           
			});
  
  
  
  jQuery('.closeBar').click(function() {
					close_target = jQuery(this).attr("rel");
    	jQuery('.' + 	close_target).toggleClass('open');
					
			});
	
	

 jQuery('.cart_row').on('click', '.closeMiniCart', function(){		
					jQuery('.widget_shopping_cart_content').toggleClass('open');					
			});
	
	 
 
  }
		
  
  //check of er een keuze is gemaakt zo niet open het taalmenu
  function UIsetCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function UIgetCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

 function language_switcher() {
  //check of er een keuze is gemaakt zo niet open het taalmenu
   var check_language_userset = UIgetCookie('language_userset');
   var check_currentlanguage = UIgetCookie('wp-wpml_current_language');
   
     if (! check_language_userset && check_currentlanguage=="en-nl"){
       jQuery('.languageBar').toggleClass('open');
     }
 
 jQuery('.languageWrap').find('.closeBar').click(function() {
    UIsetCookie("language_userset", 1, 30);
			});
 
  jQuery('.languageWrap').find('a').click(function() {
    UIsetCookie("language_userset", 1, 30);
			});
 
   }
   
		
	//Pas de link in de loop aan voor Design your own products
	function replace_link() {
	jQuery(".products").find('.product').each(function() {
		if (jQuery(this).find('.vpc-configure-button').length){
					right_link = jQuery(this).find('.vpc-configure-button').attr('href');
					jQuery(this).find('.woocommerce-LoopProduct-link').attr("href", right_link);
		}
});
	}
		
 function open_cart_panel() {
    jQuery('body').on('added_to_cart',function() {
      setTimeout(function(){
											jQuery('.widget_shopping_cart_content').addClass('open');
					},800); 
    });
				
				
}

function toggle_products() {
 jQuery('.toggle_products').click(function(e) {
   e.preventDefault();
			jQuery('body').toggleClass('show_all_products');
 });
}
 
 
 function add_sticky_container(){
  if (jQuery(".single-product").length >0){ 
   jQuery('.woocommerce-product-gallery,.summary').wrapAll('<div class="sticky_wrap"></div>');
   awardlogo=jQuery('.product_award');
    wishlist = jQuery('.summary').find('.yith-wcwl-add-to-wishlist');
    
     jQuery( ".sticky_wrap" ).find('.woocommerce-product-gallery').prepend( wishlist );
     jQuery( ".sticky_wrap" ).find('.woocommerce-product-gallery').find('.woocommerce-product-gallery__wrapper div:first-child').prepend( awardlogo );
   
  }
  
 }
 
 function close_coupon_popup(){
  jQuery('.close_coupon').click(function () {
     jQuery('.coupon_screen_wrapper').hide();
         });
 }

function product_filter(){
 if (jQuery(".productfilter").length >0){
 jQuery.fn.reverse = [].reverse;
 jQuery(".sidebar_element").find('span').reverse().each(function() {
  jQuery( ".productfilter" ).prepend( this );  
 });
 ulindex = 0;  
 jQuery(".sidebar_element").find('.woocommerce-widget-layered-nav-list').each(function() {
  jQuery( this ).attr('id','filter' + ulindex);
   jQuery(this).find('a').each(function() {
    jQuery( this ).attr('href', jQuery( this ).attr('href') + '#filter' + ulindex);
   });
 //jQuery( this ).find('a').attr('href', jQuery( this ).find('a').attr('href') + '#filter' + ulindex);
 ulindex = ulindex + 1;
 });

 
 jQuery(".productfilter").fadeIn();
 jQuery(".productfilter").find('span').click(function() {
   var index = jQuery(this).index();
   jQuery(".productfilter").find('ul').removeClass('active');
   jQuery(".productfilter").find('span').removeClass('active');
   jQuery(this).addClass('active');
    
    jQuery(".productfilter").find('ul:eq(' + index + ')').addClass('active');  
   
 });
      hash = document.URL.substr(document.URL.indexOf('#')+1);
      
     hash = hash.replace(/[^0-9]/g, '');
     
      if (hash.length>=1){
       
       jQuery(".productfilter").find('ul:eq(' + hash + ')').addClass('active');
       jQuery(".productfilter").find('span:eq(' + hash + ')').addClass('active');
       setTimeout(function() {
        jQuery('html, body').animate({scrollTop: (jQuery(".productfilter").offset().top - 150)},0);
        }, 1);  
           
      }
 }
}


//Configurator
//Open eerste item

function open_first_panel(){
  jQuery('#vpc-components .vpc-component:first-child').find('.vpc-component-arrow').click();
}


//Pas volgorde van fotos en de blend mode aan ivm met handle bar en scherm
function set_order_image(){
 

   jQuery('#vpc-preview-container').bind('DOMSubtreeModified', function(){
      
      
      
       
       ///Plaats de extra items aanzicht 0
       
         if (jQuery('#vpc-preview0').find('img').length >0){ 
            var src = jQuery('#vpc-preview0').find('img:first').attr('src'); 
             var tarr = src.split('/');      
             var file = tarr[tarr.length-1];
             var newfilename = 'cover_' + file;
             var newfile = 'https://' + location.hostname + '/wp-content/uploads/' + newfilename;
             newfile = newfile.replace("wgray0", "wgray1");
             
         }
       
        jQuery('#vpc-preview0').find('img').each(function(){         
         var img=jQuery(this).attr('src');
           if (img.indexOf("windscreen.png") >= 0){
             jQuery(this).css("mix-blend-mode", "multiply");
              jQuery(this).css("z-index", "2");
           }
     
            if (img.indexOf("windscreen") >= 0){           
             if(jQuery('#vpc-preview0').find('.extra_image').length >0){
                   jQuery('#vpc-preview0').find('.extra_image_h0').attr("src",newfile);              
             }else{              
             jQuery("#vpc-preview0").append("<img style='z-index:5;' class='extra_image' src='" + newfile + "'/>");
             jQuery("#vpc-preview0").append("<img style='z-index:1;' class='windscreensupport' src='https://" + location.hostname + "/wp-content/uploads/image_voor_windscreensupport_01.png'/>");
             
            
             }
           
             
           }
       });
        
        ///Plaats de extra items aanzicht 1
        
         if (jQuery('#vpc-preview1').find('img').length >0){ 
            var src_a = jQuery('#vpc-preview1').find('img:first').attr('src'); 
             var tarr_a = src_a.split('/');      
             var file_a = tarr_a[tarr_a.length-1];
             var newfilename_a = 'cover_' + file_a;
             var newfile_a = 'https://' + location.hostname + '/wp-content/uploads/' + newfilename_a;
             newfile_a = newfile_a.replace("wgray0", "wgray1");
             
         }
       
        jQuery('#vpc-preview1').find('img').each(function(){         
         var img_a=jQuery(this).attr('src');
         
           if (img_a.indexOf("windscreen.png") >= 0){
             jQuery(this).css("mix-blend-mode", "multiply");
               jQuery(this).css("z-index", "2");
           }
     
            if (img_a.indexOf("windscreen") >= 0){
              
             if(jQuery('#vpc-preview1').find('.extra_image').length >0){
                   jQuery('#vpc-preview1').find('.extra_image').attr("src",newfile_a);              
             }else{
              
             jQuery("#vpc-preview1").append("<img style='z-index:5;' class='extra_image' src='" + newfile_a + "'/>");
              jQuery("#vpc-preview1").append("<img style='z-index:1;' class='windscreensupport' src='https://" + location.hostname + "/wp-content/uploads/image_voor_windscreensupport_02.png'/>");
            
             }
           
             
           }
       });
        
        ///Plaats de extra items aanzicht 2
        
         if (jQuery('#vpc-preview2').find('img').length >0){ 
            var src_b = jQuery('#vpc-preview2').find('img:first').attr('src'); 
             var tarr_b = src_b.split('/');      
             var file_b = tarr_b[tarr_b.length-1];
             var newfilename_b = 'cover_' + file_b;
             var newfile_b = 'https://' + location.hostname + '/wp-content/uploads/' + newfilename_b;
             newfile_b = newfile_b.replace("wgray0", "wgray1");
             
         }
       
        jQuery('#vpc-preview2').find('img').each(function(){         
         var img_a=jQuery(this).attr('src');
         
          if (img_a.indexOf("windscreen.png") >= 0){
             jQuery(this).css("mix-blend-mode", "multiply");
             jQuery(this).css("z-index", "2");
           }
     
            if (img_a.indexOf("windscreen") >= 0){
             
             if(jQuery('#vpc-preview2').find('.extra_image').length >0){
                   jQuery('#vpc-preview2').find('.extra_image').attr("src",newfile_b);              
             }else{
              
             jQuery("#vpc-preview2").append("<img style='z-index:5;' class='extra_image' src='" + newfile_b + "'/>");
             jQuery("#vpc-preview2").append("<img style='z-index:1;' class='windscreensupport' src='https://" + location.hostname + "/wp-content/uploads/image_voor_windscreensupport_03.png'/>");
           
             }
           
             
           }
       });
        
        
        
       
       ///Plaats de extra items aanzicht 3
       
       jQuery('#vpc-preview3').find('img').each(function(){
         var img=jQuery(this).attr('src');
         
         if (img.indexOf("windscreen.png") >= 0){
          jQuery(this).css("z-index", "3");
          
            if(jQuery('#vpc-preview3').find('.windscreensupport').length >0){
             
            }else{
             jQuery("#vpc-preview3").append("<img style='z-index:1;' class='windscreensupport' src='https://" + location.hostname + "/wp-content/uploads/image_voor_windscreensupport_04.png'/>");
            }
         }           
            if (img.indexOf("handlegrip") >= 0){
            jQuery(this).css("z-index", "5");
           }
       });
       
       
       
       jQuery('#vpc-preview5').find('img').each(function(){
        
        var img=jQuery(this).attr('src');
        
         if (img.indexOf("windscreen.png") >= 0){
          jQuery(this).css("z-index", "2");
          
            if(jQuery('#vpc-preview5').find('.windscreensupport').length >0){
             
            }else{
             jQuery("#vpc-preview5").append("<img style='z-index:1;' class='windscreensupport' src='https://" + location.hostname + "/wp-content/uploads/image_voor_windscreensupport_06.png'/>");
            }
         }           
        
        if (img.indexOf("handlegrip") >= 0){
               jQuery(this).css("z-index", "3");
        }
       });


  
  
  
});



  jQuery('.bx-viewport, .bx-pager-link, .custom').click(function() {
   
   

  });
}

function replace_image_thankyou(){
   if (jQuery(".woocommerce-thankyou-order-received").length >0){
    
    jQuery('.woocommerce-table__line-item').each(function() {
		  if (jQuery(this).find('.vpc-cart-config-image').length){
					image = jQuery(this).find('.vpc-cart-config-image').find('img');
     jQuery(this).find('.thumb').find('img').hide();
      jQuery(this).find('.thumb').prepend( image );
			
		}
});
  
   }
}

///Custom datalayers
//Vind het juiste product op een configurator pagina en voeg de datalyer toe bij add to cart

function configurator_data(){  
   
    jQuery('#vpc-add-to-cart').click(function() {
  product_id = jQuery(this).attr("data-pid");
  product_price = jQuery('#vpc-preview-container').find("#vpc-price").text();
  product_price =  product_price.replace(/[^\d\,.]/g, '');
  product_price = product_price.replace(",", ".");
  

window.dataLayer.push({
   'event': 'addToCartCustom',
   'value': product_price,
   'customstoelId':  product_id
 });
   
   });
  
   
 

}
    