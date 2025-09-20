$(window).on("beforeunload", function () {
	scorm.quit();
});

$(window).on("unload", function () {
	scorm.quit();
});

$(window).on(VIEW_EVENT.READY, viewReady);

function viewReady() {
	if (window.scorm.loadObject('iniciar') == true) {
		esconderCover();
	}

	$('#comecar').click(esconderCover);

	function esconderCover() {
		window.scorm.saveObject('iniciar', true);
		$('#cover').addClass('hide');
	}
}