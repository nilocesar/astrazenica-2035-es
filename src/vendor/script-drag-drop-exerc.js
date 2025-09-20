
(function() {
    $.fn.drag_drop_exerc = function(options) {
        var BASE = {};
        var settings = $.extend({
            itemClass: 'item',
            featuredItemClass: 'featuredItens',
            confirmarClass: 'confirmar',
            call: undefined,
            limiteAlvo: 1,
            relacionar: false
        }, options);

        BASE.SETTINGS = settings;
        BASE.THIS = this;
        BASE.$container = BASE.THIS;
        BASE.$activeItem = null;
        BASE.$activeItemOld = null;
        BASE.$alvoItem = null;
        BASE.$activeItemEncap = null;
        BASE.indiceArraste = 0;
        BASE.indiceAlvo = 0;
        BASE.individual = true;

        // ///Informação das variaveis do CSS(structure.less)
        // // :root {
        // //     --mobile: @mobile;
        // //     --tablet: @tablet;
        // //     --notebook: @notebook;
        // //     --desktop: @desktop;
        // // }
        function css_var(_name, _value) {
            var gcs = getComputedStyle(document.documentElement).getPropertyValue(_name);
            return (parseInt(gcs)) ? parseInt(gcs) : _value;
        }

        //verifica a resolução min com base na variavel do CSS Tablet( tema > structure.less )
        var resolucaoMin = (css_var('--tablet', '1024') >= $(window).width()) ? true : false;
        if (BASE.SETTINGS.relacionar){
            resolucaoMin = true;
        }

        if(resolucaoMin){
            $(".arrasteInfo").html(
              "Clique no número e depois no espaço vazio correspondente para relacioná-los."
            );
        }


        $(BASE.$container).find('.' + BASE.SETTINGS.confirmarClass).hide();
        $(BASE.$container).find('.' + BASE.SETTINGS.itemClass).each(function(indice, item) {

            if ($(item).attr("arraste")) {
                BASE.indiceArraste++;
                $(item).addClass("arraste");
                $(item).addClass("arraste" + $(item).attr("arraste"));
                $(item).attr("indiceArraste", $(item).attr("arraste"));
                $(item)[0].parentInit = $(item).parent();

                if (!resolucaoMin) { // Exc de Arraste 
                    item.setAttribute('draggable', 'true');
                    $(item).on('dragstart', onDragStart);
                    $(item).parent().on('dragover', onDragOver);
                    $(item).parent().on('drop', onDrop);
                } else // Exc de Relacionar
                {

                    $(item).on('click', function(event) {
                        onArrasteClick(this, event);
                    });

                    $(item).parent().on('click', function(event) {
                        onAlvoClick(this, event);
                    });
                }
            }

            if ($(item).attr("alvo")) {
                BASE.indiceAlvo++;
                item.old = item.innerHTML;
                $(item).addClass("alvo");
                $(item).addClass("alvo" + BASE.indiceAlvo);
                $(item).attr("indiceAlvo", BASE.indiceAlvo);

                var _alvoArray = $(item).attr("alvo").split("|");
                if (_alvoArray.length > 1) {
                    BASE.individual = false;
                }

                // //Exc de Relacionar
                if (resolucaoMin) {
                    $(item).on('click', function(event) {
                        onAlvoClick(this, event);
                    });
                }
            }

            if (!resolucaoMin) { // Exc de Arraste
                $(item).on('dragover', onDragOver);
                $(item).on('drop', onDrop);
            }
        });


        if (BASE.individual) {
            BASE.SETTINGS.limiteAlvo = 1;
        }

        BASE.action = {
            status: "init",
            response: true
        };
        BASE.SETTINGS.call(BASE);

        ///////////////////////////////////////////
        //      Relacionar                       //
        ///////////////////////////////////////////

        function onArrasteClick(_this, event) {

            BASE.$activeItem = _this;

            if (!$(BASE.$activeItem).attr('encap')) {
                BASE.$activeItemEncap = BASE.$activeItem;
            }

            $('.' + BASE.SETTINGS.featuredItemClass).removeClass(BASE.SETTINGS.featuredItemClass);
            $(BASE.$activeItem).addClass(BASE.SETTINGS.featuredItemClass);

        }

        function onAlvoClick(_this, event) {

            if ($(_this).attr("alvo") || $(_this).parent().attr("alvo")) {

                if ($(_this).parent().attr("alvo")) {
                    BASE.$alvoItem = $(_this).parent();
                } else {
                    BASE.$alvoItem = $(_this);
                }

                //arraste Inicial -> alvo
                if (!$(BASE.$activeItem).attr('encap')) {

                    var _obj = $(BASE.$activeItem).clone();
                    var _parent = $(BASE.$activeItem).parent();
                    $(_obj).addClass("cloneItens");
                    $(BASE.$alvoItem).append(BASE.$activeItem);
                    _parent.append(_obj);

                    $(BASE.$activeItem).attr('encap', 'init');
                    BASE.$activeItem = null;
                    BASE.$alvoItem = null;
                    $('.' + BASE.SETTINGS.featuredItemClass).removeClass(BASE.SETTINGS.featuredItemClass);


                } else {

                    //arraste Inicial -> alvo com 1 a mais elemento
                    if (BASE.$activeItemEncap && !$(BASE.$activeItemEncap).attr('encap')) {


                        if (!BASE.individual) {

                            if ($(BASE.$alvoItem)[0].children.length >= BASE.SETTINGS.limiteAlvo) {
                                return false;
                            }

                            var _obj = $(BASE.$activeItemEncap).clone();
                            var _parent = $(BASE.$activeItemEncap).parent();
                            $(_obj).addClass("cloneItens");
                            $(BASE.$alvoItem).append(BASE.$activeItemEncap);
                            _parent.append(_obj);

                            $(BASE.$activeItemEncap).attr('encap', 'init');
                            BASE.$activeItem = null;
                            BASE.$alvoItem = null;
                            BASE.$activeItemEncap = null;
                            $('.' + BASE.SETTINGS.featuredItemClass).removeClass(BASE.SETTINGS.featuredItemClass);

                            return false;


                        } else {

                        }
                    }

                    /// alvo para alvo
                    if (BASE.$activeItemOld) {

                        if ($(BASE.$activeItemOld).parent() != $(BASE.$alvoItem)) {

                            if (!BASE.individual) {
                                if ($(BASE.$alvoItem)[0].children.length >= BASE.SETTINGS.limiteAlvo) {
                                    return false;
                                }
                                $(BASE.$alvoItem).append(BASE.$activeItemOld);

                            } else {
                                var _parentOld = $(BASE.$activeItemOld).parent();
                                $(BASE.$alvoItem).append(BASE.$activeItemOld);
                                if ($(BASE.$alvoItem)[0].children.length > 1) {
                                    _parentOld.append(BASE.$activeItem);
                                }
                            }

                            BASE.$activeItem = null;
                            BASE.$alvoItem = null;
                            BASE.$activeItemOld = null;
                            $('.' + BASE.SETTINGS.featuredItemClass).removeClass(BASE.SETTINGS.featuredItemClass);

                        }

                    } else {
                        BASE.$activeItemOld = BASE.$activeItem;
                    }
                }
            } else {
                /// dentro do alvo e vc quer voltar para o arraste incial
                if ($(BASE.$activeItem).attr('encap')) {
                    var parentOld = $(BASE.$activeItem)[0].parentInit;
                    $(parentOld).find('.cloneItens').remove();
                    $(parentOld).append(BASE.$activeItem);

                    $(BASE.$activeItem).removeAttr('encap');
                    BASE.$activeItem = null;
                    BASE.$alvoItem = null;
                    BASE.$activeItemOld = null;
                    $('.' + BASE.SETTINGS.featuredItemClass).removeClass(BASE.SETTINGS.featuredItemClass);
                }
            }



            statusConfirmar();

        }




        ///////////////////////////////////////////
        //      DRAG DROP                        //
        ///////////////////////////////////////////

        function onDragStart(event) {
            BASE.$activeItem = this;
            event.originalEvent.dataTransfer.effectAllowed = 'move';
            event.originalEvent.dataTransfer.setData('text/html', this.innerHTML);
            BASE.action = {
                status: "drag",
                response: {
                    "drag": this,
                    "drop": null
                }
            };

            $('.' + BASE.SETTINGS.featuredItemClass).removeClass(BASE.SETTINGS.featuredItemClass);
            $(BASE.$activeItem).addClass(BASE.SETTINGS.featuredItemClass);

            BASE.SETTINGS.call(BASE);
        }

        function onDragOver(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }

            event.originalEvent.dataTransfer.dropEffect = 'move';
            BASE.action = {
                status: "over",
                response: {
                    "drag": this,
                    "drop": null
                }
            };
            BASE.SETTINGS.call(BASE);
            return false;
        }

        function onDrop(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }

            var dragThis = BASE.$activeItem;
            var dropThis = this;

            if ($(dropThis).attr("alvo") || $(dropThis).parent().attr("alvo")) {

                if (!BASE.individual) {
                    if ($(dropThis).parent().attr("alvo")) {
                        if ($(dropThis).parent().children().length >= BASE.SETTINGS.limiteAlvo) {
                            return false;
                        }
                    } else {
                        if ($(dropThis).children().length >= BASE.SETTINGS.limiteAlvo) {
                            return false;
                        }
                    }
                }

                $(dragThis).parent().removeAttr("a" + $(dragThis).attr("indiceArraste"));
                if (!dragThis.oldParent) dragThis.oldParent = $(dragThis).parent();

                var dropObj = null;
                if ($(dropThis).parent().attr("alvo")) {
                    dropObj = $(dropThis).parent();
                } else {
                    dropObj = $(dropThis);
                }

                dropObj.append(dragThis);
                dropObj.attr("a" + $(dragThis).attr("indiceArraste"), "1");

                //Verificação apenas quando todos os alvos têm apenas um item
                if (BASE.individual && dropObj.children().length > 1) {
                    dropObj.removeAttr("a" + dropObj.children().eq(0).attr("arraste"));
                    var oldParent = dropObj.children().eq(0)[0].oldParent;
                    $(oldParent).find('.cloneItens').remove();
                    $(oldParent).append(dropObj.children().eq(0));
                    $(dropObj.children().eq(0)).attr('alvoAtivo', 0);
                }


                var _obj = $(dragThis).clone();
                $(_obj).addClass("cloneItens");
                dragThis.oldParent.find('.' + BASE.SETTINGS.itemClass).remove();
                dragThis.oldParent.append(_obj);
                $(dragThis).attr('alvoAtivo', 1);

            } else {
                if ($(dropThis).attr('alvoAtivo') == 1) {
                    return false;
                }

                $(dragThis).parent().removeAttr("a" + $(dragThis).attr("indiceArraste"));
                $(dragThis.oldParent).append(dragThis);
                $(dragThis.oldParent).find('.cloneItens').remove();
                $(dragThis).attr('alvoAtivo', 0);
            }

            BASE.action = {
                status: "drop",
                response: {
                    "drag": dragThis,
                    "drop": dropThis
                }
            };
            BASE.SETTINGS.call(BASE);
            statusConfirmar();
            return false;
        }

        function statusConfirmar() {
            var _alvoMudado = 0;
            $(BASE.$container).find('.alvo').each(function(indice, item) {
                _alvoMudado += $(item).find('.arraste').length;
            });

            if (_alvoMudado > 0) {
                $(BASE.$container).find('.' + BASE.SETTINGS.confirmarClass).fadeIn();
                $(BASE.$container).find('.' + BASE.SETTINGS.confirmarClass).removeClass("hide");
            } else {
                $(BASE.$container).find('.' + BASE.SETTINGS.confirmarClass).hide();
                $(BASE.$container).find('.' + BASE.SETTINGS.confirmarClass).addClass("hide");
            }
        }

        $(BASE.$container).find('.' + BASE.SETTINGS.confirmarClass).on('click', function(event) {

            BASE.$activeItem = null;
            BASE.$alvoItem = null;
            BASE.$activeItemEncap = null;
            $('.' + BASE.SETTINGS.featuredItemClass).removeClass(BASE.SETTINGS.featuredItemClass);

            $(BASE.$container).find('.alvo').each(function(indice, item) {

                $(item).find('.arraste').each(function() {
                    var _arraste = $(this).attr('arraste');
                    $(item).attr("a" + _arraste, 1);
                })

            })

            var _statusConfere = true;
            $(BASE.$container).find('.alvo').each(function(indice, item) {

                if ($(item).attr("alvo") != 0) {
                    var _alvoArray = $(item).attr("alvo").split("|");

                    for (var i = 0; i < _alvoArray.length; i++) {
                        if (!$(item).attr("a" + _alvoArray[i])) {
                            $(item).attr("erro", 1);
                            _statusConfere = false;
                        }
                    }
                }

            }); //

            BASE.action = {
                status: "confirmar",
                response: _statusConfere
            };
            BASE.SETTINGS.call(BASE);
        });
    };
})(jQuery);
