"use strict";

events.on('ready', function() {
    initQuiz("quiz1");
    initQuiz("quiz2");
    initQuiz("quiz3");
    initQuiz("quiz4");
    initQuiz("quiz5");
});

function initQuiz(q_id) {
    var blockList = $("#" + q_id).find(".alternativasContainer");

    // console.log(blockList);
    for (var i = 0; i < blockList.length; i++) {
        //console.log($(blockList[i].childNodes)) ;
        registerBlock($(blockList[i]), $(blockList[i].childNodes));
    }

    $("#" + q_id).find(".confimBt").click(function() {
        $(this).hide();
        continuar($(this).parents(".quizConteudo"));

    });
}

function registerBlock(blockElement, alterList) {
    for (var i = 0; i < alterList.length; i++) {
        if ($(alterList[i]).hasClass("alternativa")) {
            $(alterList[i]).click(function() {
                selectedAlter($(this), alterList);
            });
        }
    }
}

function selectedAlter(selected, alterList) {
    for (var alternativa in alterList) {
        if (alterList[alternativa].classList != undefined) {
            $(alterList[alternativa]).removeClass('selecionado');
        }
    }

    var containnerRef = selected.parents(".quizConteudo");

    // console.log(selected.parents(".quizConteudo").find(".confimBt"));
    selected.addClass('selecionado'); // setTimeout(function(){

    if (allBlocksHasSelecteds(containnerRef)) {
        containnerRef.find('.confimBt').css("display", "block");
    } // }, 1000)

}

function allBlocksHasSelecteds(containnerRef) {
    var alterList = containnerRef.find('.alternativa');
    var blockList = containnerRef.find('.alternativasContainer');
    var countSelected = 0;
    var bl = false;

    for (var i = 0; i < alterList.length; i++) {
        if ($(alterList[i]).hasClass("selecionado")) {
            countSelected = countSelected + 1;
        }
    }

    if (blockList.length == countSelected) {
        bl = true;
    }

    return bl;
}

function continuar(containnerRef) {

    // console.log(containnerRef);

    //containnerRef.find(".alternativa").addClass("avoid-clicks");
    containnerRef.find(".alternativa").css("pointer-events", "none");
    //var indicadores = $('.quiz').data('indicadores-positivo');

    if (acertou(containnerRef)) {
        containnerRef.find('.feedPositivo').css("display", "block");
        $(containnerRef).data("tentativa", true);
        acertou(containnerRef);
        //indicadores = $('.quiz').data('indicadores-positivo');
    } else {
        //Tentativas
        if (!$(containnerRef).data("tentativa")) {
            $(containnerRef).data("tentativa", true);
            $(containnerRef).data("feedNegativo", containnerRef.find('.feedNegativo').find('.pfeed')[0].innerHTML);

            containnerRef.find('.feedNegativo').find('.pfeed').empty();
            containnerRef.find('.feedNegativo').find('.pfeed').html("Não foi dessa vez, tente novamente!");
            containnerRef.find('.feedNegativo').css("display", "block");
            containnerRef.find('.feedNegativo').find(".modal-close").css("display", "none");

            setTimeout(function() {
                containnerRef.find('.feedNegativo').css("display", "none");
                //Refazer
                refazer(containnerRef);

            }, 2000);



        } else {
            containnerRef.find('.feedNegativo').css("display", "block");
            containnerRef.find('.feedNegativo').find(".modal-close").css("display", "block");

            if ($(containnerRef).data("feedNegativo")) {
                containnerRef.find('.feedNegativo').find('.pfeed').empty();
                containnerRef.find('.feedNegativo').find('.pfeed').html($(containnerRef).data("feedNegativo"));
            }

        }

        //indicadores = $('.quiz').data('indicadores-negativo');
    }

    //scorm.saveObject('lastMotivacao', bridge.getIndicadorTotal("motivacao"));
    //scorm.saveObject('lastDesenvolvimento', bridge.getIndicadorTotal("desenvolvimento"));

    // for (var indicador in indicadores) {
    //   if (indicadores.hasOwnProperty(indicador)) {
    //     var valor = indicadores[indicador];
    //     bridge.addIndicador(indicador, $('.quiz')[0].id, valor);
    //   }
    // }
}

function acertou(containnerRef) {
    var selectedItens = containnerRef.find('.selecionado');
    var acertou = true;
    var tentativa = $(containnerRef).data("tentativa");

    for (var i = 0; i < selectedItens.length; i++) {
        var alternativa = selectedItens[i];


        if ($(alternativa).data('aceto') == false) {
            acertou = false;
            // if(tentativa){
            // $(alternativa).css("background-color", "red");
            $(alternativa).addClass("errou");

            // }

        } else {
            // if(tentativa){
            // $(alternativa).css("background-color", "green");
            $(alternativa).addClass("acertou");
            // }
        }

        $(alternativa).removeClass("selecionado");

    }

    return acertou;
}

function refazer(containnerRef) {

    // var selectedItens = containnerRef.find('.selecionado');
    // containnerRef.find('.selecionado').removeClass("selecionado");

    // for (var i = 0; i < selectedItens.length; i++) {
    //   var alternativa = selectedItens[i];
    //   $(alternativa).css("background-color", "rgba(255, 255, 255, 0.4)");
    // }

    containnerRef.find(".alternativa").css("pointer-events", "visible");
    // containnerRef.find(".alternativa").css("background-color", "rgba(255, 255, 255, 0.4)");

    containnerRef.find(".alternativa").removeClass('acertou');
    containnerRef.find(".alternativa").removeClass('errou');
    containnerRef.find(".alternativa").removeClass('selecionado');
}

(function($) {
    $.fn.shuffle = function() {
        var allElems = this.get(),
            getRandom = function getRandom(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function() {
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
            });

        this.each(function(i) {
            $(this).replaceWith($(shuffled[i]));
            $(shuffled[i]).attr('tabindex', i + 2);
        });
        return $(shuffled);
    };
})(jQuery);