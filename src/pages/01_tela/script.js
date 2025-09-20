events.on("ready", function () {
  modal();
  exercTime();
  dragdrop();
  quiz();

  //controlComplete();
  animate_wow();

  controlBlock();

  $(".btnVoltar").on("click", function () {
    navigate.goto("00_menu");
  });

  document.querySelectorAll(".flipcard").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });

  $(".itsDSFD .it .intT").addClass('hide');

  $(".itsDSFD .it").on('click', function () {

    $(this).find(".intT").removeClass("hide");
    $(this).find(".infB").addClass("hide");

    if ($(this).hasClass("it3")) {
      $("#local3").removeClass("inativeIn");
    }
    
  })
});

function controlBlock() {
  var uidPAGE = window.uid;
  $(".atB").addClass("inativeIn");

  setTimeout(function () {
    $(".loaderBase").css("display", "none");
    if (scorm.loadObject("local" + uidPAGE)) {
      const local = scorm.loadObject("local" + uidPAGE);

      $("html, body").animate(
        {
          scrollTop: $("#local" + local).offset().top - $(".baseTop").height(),
        },
        0
      );
    }
  }, 1000 * 1);

  if (scorm.loadObject("localMaior" + uidPAGE)) {
    var localMaior = scorm.loadObject("localMaior" + uidPAGE);

    for (var i = 1; i <= parseInt(localMaior); i++) {
      $(`[local=${i}]`).removeClass("inativeIn");
    }
  }

  $(".local").each(function (it, elem) {
    const id = $(elem)[0].id;
    $("#" + id).isInViewportComplete({
      container: window,
      call: function (_this) {
        scorm.saveObject("local" + uidPAGE, parseInt($(_this).attr("local")));

        if (scorm.loadObject("localMaior" + uidPAGE)) {
          var localMaior = scorm.loadObject("localMaior" + uidPAGE);
          if (parseInt(localMaior) <= parseInt($(_this).attr("local"))) {
            scorm.saveObject(
              "localMaior" + uidPAGE,
              parseInt($(_this).attr("local"))
            );
          }
        } else {
          scorm.saveObject(
            "localMaior" + uidPAGE,
            parseInt($(_this).attr("local"))
          );
        }
        // scorm.setCompleted();
      },
    });
  });
}

function modal() {
  $(".openModal").on("click", function () {
    var mod = $(this).attr("mod");
    $("." + mod).css("display", "flex");
    $("html").css("overflow-y", "hidden");
  });

  $(".modalGeral").css("display", "none");
 
  $(".modalGeral .modal-close").on("click", function () {
    $(".modalGeral").css("display", "none");
    $("html").css("overflow-y", "auto");
    $(this).parent().find("video").get(0).pause();

    if ($(this).hasClass("modal-complete")) {
      console.log("complete one-page");
      scorm.setCompleted();
    }
  })

  $(".modalGeral1 .modal-close").on("click", function () {
    
    $("[local=2]").removeClass("inativeIn");
    $(".loaderBase").css("display", "flex");

    setTimeout(function () {
      $(".loaderBase").css("display", "none");
      $("html, body").animate(
        {
          scrollTop: $("#local2").offset().top,
        },
        500
      );
    }, 1000 * 1);

   
  });
}

function getCache(_template) {
  var uidPAGE = window.uid;
  var exItem = _template.attr("exer");

  if (scorm.loadObject("dragdrop")) {
    //var dragdrop = JSON.parse(scorm.loadObject('dragdrop'));
    var dragdrop = scorm.loadObject("dragdrop");

    // console.log("dragdrop", dragdrop);

    if (dragdrop.length > 0) {
      $.each(dragdrop, function (indice, item) {
        if (item.uid == uidPAGE && item.q == exItem) {
          // console.log("item" + item);
          // $(_template).find(".button-confirm").removeClass("hide");
          // $(_template).find(".button-confirm").html(cacheBtn);

          $(_template)
            .find(".alvo")
            .each(function (ind, it) {
              var alv = item.a[ind];
              if (alv.length > 0) {
                $.each(alv, function (indX, itemX) {
                  $(it).attr("a" + itemX, 1);
                  $(it).attr("alvoAtivo", 1);

                  var _arraste = $(_template).find(".arraste" + itemX);
                  var _clone = _arraste.clone();
                  _arraste.addClass("cloneItens");

                  $(it).append(_clone);
                });
              }
            });

          // $(_template).find(".arraste").removeClass("featuredItens");
          $(_template).find(".arraste").css("pointer-events", "none");
          $(_template).find(".alvo").css("pointer-events", "none");

          setTimeout(function () {
            $(_template).find(".confirmar").trigger("click");
          }, 1000 * 1);
        }
      });
    }
  }
}

function saveCache(_template, resFeed) {
  var arrasteAll = $(_template).find(".dragDrop_element").length;
  var exItem = _template.attr("exer");
  var uidPAGE = window.uid;
  //// informação para caso precise salvar no suspendata
  var drag_drop = [];
  var drag_drop_cache = [];
  if (scorm.loadObject("dragdrop")) {
    drag_drop = scorm.loadObject("dragdrop");
  }

  $(_template)
    .find(".alvo")
    .each(function (indice, item) {
      var alvo = [];
      for (var i = 1; i <= arrasteAll; i++) {
        if ($(this).attr("a" + i)) {
          alvo.push(i);
        }
      }
      drag_drop_cache.push(alvo);
    });

  $.each(drag_drop, function (indice, it) {
    try {
      if (it && it["uid"] == uidPAGE && it["q"] == exItem) {
        drag_drop.splice(indice, 1);
      }
    } catch (e) {
      // declarações para manipular quaisquer exceções
      console.error("erro no array do dragdrop", e); // passa o objeto de exceção para o manipulador de erro
    }
  });

  var _obj = {
    uid: uidPAGE,
    q: exItem,
    a: drag_drop_cache,
    r: parseInt(resFeed),
  };

  drag_drop.push(_obj);
  scorm.saveObject("dragdrop", drag_drop);
}

function dragdrop() {
  $(".arrasteExercicio").each(function () {
    var _template = $(this);

    _template.find(".feed").css("display", "none");
    _template.find(".alert").css("display", "none");
    _template.find(".infoFinish").css("display", "none");

    ///randomizar arrastes
    // _template.find(".contCons").html(
    //   _template.find(".contCons .contContainer").sort(function () {
    //     return Math.random() - 0.5;
    //   })
    // );

    $(_template).drag_drop_exerc({
      itemClass: "dragDrop_element",
      limiteAlvo: 1,
      call: function (e) {
        if (e.action.status == "init") {
          getCache(_template);
        }
        if (e.action.status == "confirmar") {
          //e.action.response

          $(_template).find(".confirmar").css("display", "none");
          $(_template).find(".dragDrop_element").addClass("inativoArraste");

          var _status = "positivo";
          if (e.action.response == true) {
            _template.find(".feed-pos").css("display", "flex");
            _template.find(".alert").css("display", "block");
            // $(_template).attr("res-feed", 1);
            saveCache(_template, 1);
          } else {
            _template.find(".feed-neg").css("display", "flex");
            _template.find(".alert").css("display", "block");
            _status = "negativo";
            // $(_template).attr("res-feed", 0);
            saveCache(_template, 0);
          }

          // $("html, body").animate(
          //   {
          //     scrollTop:
          //       $(_template).offset().top -
          //       $(".header").height() -
          //       $(".header").height() * 0.5,
          //   },
          //   500
          // );

          $("[local=4]").removeClass("inativeIn");
          $("[local=5]").removeClass("inativeIn");
          $("[local=6]").removeClass("inativeIn");

          if (_template.attr("end") == 1) {
            scorm.setCompleted();
            _template.find(".infoFinish").css("display", "flex");
          }

          // scorm.saveObject("arraste" + _template.attr("arraste"), _status);
        }
      },
    });
  });
}

function quiz() {
  $(".containerExercicio .btnConfrmar").css("display", "none");
  $(".containerExercicio .feed").css("display", "none");
  $(".rodape").css("display", "none");

  $(".exercicioInit").each(function () {
    var _template = $(this);

    _template.find(".alter").on("click", function () {
      _template.find(".alter").removeClass("active");
      $(this).addClass("active");

      _template.attr("res", $(this).attr("res"));
      _template.attr("indice", $(this).attr("indice"));

      confereBtn();
    });

    $(".containerExercicio .btnConfrmar").on("click", function () {
      var res = 0;

      $(".exercicioInit").each(function (ind, it) {
        var _template = $(this);

        _template.find(".alter").each(function (indice, item) {
          if ($(item).attr("res") == 1) {
            $(item).find(".selector").addClass("pos");
          }
        });

        if (_template.attr("res") == 1) {
          res += 1;
          _template.find(".active .selector").addClass("pos");
          scorm.saveObject("quiz" + (ind + 1), "positivo");
        } else {
          _template.find(".active .selector").addClass("neg");
          scorm.saveObject("quiz" + (ind + 1), "negativo");
        }

        avaliacao(ind, _template.attr("correta"), _template.attr("indice"));
      });

      var _feed = null;
      if (res == 5) {
        _feed = $(".containerExercicio .feed-positivo1");
        $(".containerExercicio .feed-positivo1").css("display", "flex");
      } else if (res == 4) {
        _feed = $(".containerExercicio .feed-positivo2");
        $(".containerExercicio .feed-positivo2").css("display", "flex");
      } else {
        _feed = $(".containerExercicio .feed-negativo");
        $(".containerExercicio .feed-negativo").css("display", "flex");
      }

      $(".containerExercicio .btnConfrmar").css("display", "none");
      $(".rodape").css("display", "block");

      // $("html, body").animate(
      //   {
      //     scrollTop:
      //       _feed.offset().top -
      //       $(".header").height() -
      //       $(".header").height() * 0.5,
      //   },
      //   500
      // );

      $(".containerExercicio .alter").addClass("inativ");
    });
  });

  function confereBtn() {
    var _status = true;
    $(".exercicioInit").each(function () {
      var _template = $(this);
      if (!_template.attr("res")) _status = false;
    });

    if (_status) {
      $(".containerExercicio .btnConfrmar").css("display", "flex");

      // $("html, body").animate(
      //   {
      //     scrollTop: $(".containerExercicio .btnConfrmar").offset().top,
      //   },
      //   500
      // );
    }
  }
}

function exercTime() {
  $(".exercic02 .feedImg").css("display", "none");

  const exerc02 = (_this) => {
    $(".exercic02 .itq").css("pointer-events", "none");

    var _it = $(_this).attr("it");
    var _ques = $(_this).attr("ques");
    scorm.saveObject("quesRes" + window.uid, _ques);

    if (_it == 1) {
      $(_this).addClass("itPos");
      $(".exercic02 .feedImgPos").css("display", "block");
    } else {
      $(_this).addClass("itNeg");
      $(".exercic02 .feedImgNeg").css("display", "block");
      $(".exercic02 .itq[it=1]").addClass("itPos");
    }

    $(".inativeB").removeClass("inativeB");
  };

  $(".exercic02 .itq").on("click", function () {
    exerc02(this);

    $("html, body").animate(
      {
        scrollTop: $(".exercic02").offset().top - $(".header").height() * 10,
      },
      500
    );
  });

  if (scorm.loadObject("quesRes" + window.uid)) {
    var quesRes = scorm.loadObject("quesRes" + window.uid);
     exerc02($(`.exercic02 [ques=${quesRes}]`));
     $(".inativeB").removeClass("inativeB");
  }
}

function avaliacao(_indice, _correta, _resposta) {
  var _status = "";
  var _id = "a" + _indice;
  var _idObj = _id + "Obj";

  if (_resposta == _correta) _status = "correct";
  else _status = "wrong";

  console.log(_indice + " " + _status + " " + _id + " " + _idObj);

  ///
  scorm.set("cmi.interactions." + _indice + ".id", _id);
  scorm.set("cmi.interactions." + _indice + ".type", "choice"); // choice
  scorm.set("cmi.interactions." + _indice + ".objectives.0.id", _idObj);
  scorm.set("cmi.interactions." + _indice + ".time", "00:00:12.0"); /// Tempo que foi dada a resposta
  scorm.set(
    "cmi.interactions." + _indice + ".correct_responses.0.pattern",
    _correta
  ); /// Resposta correta.
  scorm.set("cmi.interactions." + _indice + ".student_response", _resposta); /// Resposta dada.
  scorm.set("cmi.interactions." + _indice + ".result", _status); /// Status da resposta Resposta.
  scorm.set("cmi.interactions." + _indice + ".weighting", 1); // Peso da questão
  scorm.set("cmi.interactions." + _indice + ".latency", "00:00:12"); // tempo gasto
  scorm.save();
}

function controlComplete() {
  $("#local6").isInViewportComplete({
    container: window,
    call: function () {
      console.log("complete one-page");
      scorm.setCompleted();
    },
  });
}

function animate_wow() {
  // scorm.setCompleted();
  // Helper function for add element box list in WOW
  WOW.prototype.addBox = function (element) {
    this.boxes.push(element);
  };

  var wow = new WOW({
    boxClass: "wow", // default
    animateClass: "animated", // default
    offset: 0, // default
    mobile: true, // default
    live: true, // default
  });
  wow.init();

  $(".pulse").addClass("animated pulse infinite");
  $(".flash").addClass("wow animated flash infinite");
  $(".left").addClass("wow animated fadeInLeft");
  $(".right").addClass("wow animated fadeInRight");
  $(".down").addClass("wow animated fadeInDown");
  $(".in").addClass("wow animated fadeIn");
  $(".up").addClass("wow animated fadeInUp");
  $(".zoomIn").addClass("wow animated zoomIn");
  $(".rotateIn").addClass("animated rotateIn");
  $(".lightSpeedInRight").addClass("animated lightSpeedInRight");
  $(".jackInTheBox").addClass("animated jackInTheBox");
  $(".flipInX").addClass("animated flipInX");
  $(".flipInY").addClass("animated flipInY");

  for (let i = 1; i < 18; i++) {
    var tempo = i / 2;
    $(".delay" + i).css("animation-delay", tempo + "s");
  }
}
