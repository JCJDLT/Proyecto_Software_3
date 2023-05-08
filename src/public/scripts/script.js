$('.portfolio-menu ul li').click(function(){
	$('.portfolio-menu ul li').removeClass('active');
	$(this).addClass('active');
	$('.portfolio-item').isotope({
		itemSelector: '.item',
		layoutMode: 'fitRows'
	})
	let selector = $(this).attr('data-filter');
	$('.portfolio-item').isotope({
		filter:selector
	});
	return  false;
});
$(document).ready(function() {
let popup_btn = $('.popup-btn');
popup_btn.magnificPopup({
type : 'image',
gallery : {
	enabled : true
}
});
});