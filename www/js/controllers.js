var Player;
var myIoSocket = {};
var state;
var ytVideo;

function getPlayer() {
    if (Player && Player.data('player') && Player.data('player').p) return Player.data('player').p
    return false
}
setTimeout(function () {
    /*
      setInterval(function(){
        if(getPlayer()){
          totali = getPlayer().getDuration()
          correnti  = getPlayer().getCurrentTime()
          if((correnti+3)>=totali){
          getPlayer().seekTo(0)
          }
        }
      },1000);
      */
}, 3000);
setTimeout(function () {
    myIoSocket = io.connect(url4);
    myIoSocket.nome = window.localStorage.getItem("nome")
    myIoSocket.remoto = window.localStorage.getItem("remoto")
    if (myIoSocket.nome) myIoSocket.emit("registra", myIoSocket.nome)

    myIoSocket.on('recive_play', function (remoto) {
        if (getPlayer()) return Player.data('player').p.playVideo()
    });

    myIoSocket.on('recive_volume', function (remoto, volume) {
        window.localStorage.setItem("volume", volume)
        if (getPlayer()) return Player.data('player').p.setVolume(volume)
    });

    myIoSocket.on('recive_pause', function (remoto) {
        if (getPlayer()) return Player.data('player').p.pauseVideo()
    });

    myIoSocket.on('recive_video', function (remoto, video) {
        video = angular.fromJson(video)
        myIoSocket.current = video
        state.go('tab.player')
    });
});

function myIoSocket_send_video(video) {
    return myIoSocket.emit("send_video", myIoSocket.remoto, JSON.stringify(video))
}

angular.module('starter.controllers', [])

.factory('suggestFactory', function ($http) {
    var suggerimenti
    return {
        getAsync: function (key, callback) {
            $http.jsonp(url + key).success(callback);
        }
    };
})

.factory('ytVideo', function ($http) {
        var videos
        var current
        var player
        var lista = []
        return {
            getAsync: function (key, callback) {

                $http.jsonp(url2 + key).success(callback);
            }
        };
    })
    .controller('TransCtrl', function ($scope, $timeout, $state, $http, $ionicModal, $translate) {
        $scope.lingue = lingue
        $scope.tab = 'lingua'
        if (window.localStorage.getItem("lingua")) {
            filtrate = $(lingue).filter(function () {
                if (this.code == window.localStorage.getItem("lingua")) return true
            })
            $scope.linguasel = (filtrate.length) ? filtrate[0] : lingue[0]
        }
        $scope.set_lingua = function (lingua) {
            $scope.linguasel = lingua
            $translate.use(lingua.code)
            window.localStorage.setItem("lingua", lingua.code)
        }

        $scope.cambia_tab = function (tab) {
            if (event) event.preventDefault();
            $scope.tab = tab
        }


        $ionicModal.fromTemplateUrl('templates/settings-modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();
            //focus su cerca
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
    })

.controller('DownCtrl', function ($scope, ytVideo, $timeout, $state, $http) {
    state = $state
    $('#video').addClass("noyt")
    $scope.lista = ytVideo.lista
    $($scope.lista).each(function () {
        video = this
        if (!(video.link)) {
            video.errori = false
            nome = (video.title).replace(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });
            $http.jsonp(url3 + "&id=" + video.id + "&nome=" + nome + ".mp3").success(
                function (data) {
                    if (data.link) {
                        video.link = data.link;
                    } else {
                        if (data.errori) video.errori = data.errori;
                    }
                });
        }
    })
})


.controller('SyncCtrl', function ($scope, ytVideo, $timeout, $state) {
    state = $state
    $('#video').addClass("noyt")
    $scope.nome = $scope.richiesta = myIoSocket.nome || window.localStorage.getItem("nome") || ""
    $scope.remoto = myIoSocket.remoto || window.localStorage.getItem("remoto") || ""
    $scope.video = myIoSocket.video

    $scope.registra = function (nome) {
        if (!(nome)) return myIoSocket.emit("registra", '');
        $scope.timeout = true
        myIoSocket.emit("registra", nome)

    }

    $scope.collega = function (remoto) {
        $scope.remoto = myIoSocket.remoto = remoto
        myIoSocket.emit("collega", remoto)
        window.localStorage.setItem("remoto", myIoSocket.remoto)
    }

    $scope.set_nome = function (nome) {
        $timeout(function () {
            $scope.nome = myIoSocket.nome = nome
            window.localStorage.setItem("nome", myIoSocket.nome || "")
            $scope.timeout = false;
        }, 1)
    }
    $timeout(function () {
        myIoSocket.on('conferma', function (nome) {
            $scope.set_nome(nome)
        });
        myIoSocket.on('collegato', function (nome) {
            $scope.collegato = nome
            $scope.$apply()
        });

        myIoSocket.on('sync_volume', function (volume) {
            $scope.remotevolume = myIoSocket.volume = volume
            $("input[name=volume]").val(1)
            $scope.$apply()
        });

        myIoSocket.on('rifiuta', function (nome) {
            $scope.set_nome('')
        });
    }, 300)


    $scope.send_play = function () {
        if ($scope.remoto) myIoSocket.emit("send_play", $scope.remoto)
    }

    $scope.send_pause = function () {
        if ($scope.remoto) myIoSocket.emit("send_pause", $scope.remoto)
    }

    $scope.send_volume = function (remotevolume) {
        $scope.remotevolume = remotevolume
        if ($scope.remoto) myIoSocket.emit("send_volume", $scope.remoto, remotevolume)
    }

    setTimeout(function () {
        if ($scope.nome) $scope.registra($scope.nome)
        if ($scope.remoto) $scope.collega($scope.remoto)
    }, 100)
})

.controller('PlayerCtrl', function ($rootScope, $scope, ytVideo, $state) {
    $scope.volume = (window.localStorage.getItem("volume") == null) ? 100 : window.localStorage.getItem("volume")

    $scope.downloader = downloader
    state = $state
    setTimeout(function () {
        myIoSocket.on('recive_video', function (remoto, video) {

            $scope.start()

        });

        myIoSocket.on('recive_volume', function (remoto, volume) {
            $scope.volume = volume
            $scope.$apply()
            window.localStorage.setItem("volume", volume)
        });


    }, 100)
    $scope.onPlay = function (event) {
        $scope.volume = (window.localStorage.getItem("volume") == null) ? 100 : window.localStorage.getItem("volume")
        if (getPlayer()) Player.data('player').p.setVolume($scope.volume);
        $scope.isPlaying = ytVideo.isPlaying = true
        $scope.$apply()
    }

    $scope.onPause = function (event) {
        $scope.isPlaying = ytVideo.isPlaying = false
        $scope.$apply()
    }

    $scope.onEnd = function (event) {
        //loop
        getPlayer().seekTo(0)
    }

    $scope.scaricato = function () {
        video = $scope.current
        esistenti = _.filter(ytVideo.lista, function (v) {
            return v.id == video.id
        })
        return (esistenti.length == 0) ? false : true

    }
    $scope.set_volume = function (volume) {
        if (event) event.preventDefault();
        $scope.volume = volume
        window.localStorage.setItem("volume", volume)
        if (getPlayer()) return Player.data('player').p.setVolume(volume)
        if (myIoSocket.nome) myIoSocket.emit("sync_volume", myIoSocket.nome, volume)

    }


    $scope.elimina = function () {
        if (event) event.preventDefault();
        if (!(getPlayer())) return false;
        $("#video").replaceWith($('<div id="video"></div>'));
        Player.data('player', false)
        $scope.current = myIoSocket.current = false
    }

    $scope.down_video = function () {
        video = $scope.current
        if (event) event.preventDefault();
        ytVideo.lista = (ytVideo.lista) ? ytVideo.lista : []
        esistenti = _.filter(ytVideo.lista, function (v) {
            return v.id == video.id
        })
        if (esistenti.length == 0) ytVideo.lista.push(video)
    }

    $scope.play_pause = function () {
        if (event) event.preventDefault();
        if (!(getPlayer())) return false;
        if ($scope.player.data('player').p.getPlayerState() == 1) {
            $scope.pause()
        } else {
            $scope.play()
        }
    }

    $scope.play = function () {
        if (getPlayer())
            if ($scope.player.data('player').p.getPlayerState() != 1) $scope.player.data('player').p.playVideo()
    }

    $scope.pause = function () {
        if (getPlayer())
            if ($scope.player.data('player').p.getPlayerState() == 1) $scope.player.data('player').p.pauseVideo()
    }

    $scope.start = function () {

        $('#video').removeClass("noyt")
        $scope.current = myIoSocket.current
        $scope.player = ytVideo.player
        $scope.isPlaying = ytVideo.isPlaying

        //$scope.current = {'id':'xTvu0mAIEAs'}
        //nessun video selezionato
        if (!($scope.current)) return false;

        //semplice change tab ritorna false
        if ($scope.player && $scope.player.data('player') && $scope.player.data('player').options.video == $scope.current.id) return false;
        resize_video()

        if ($scope.player && $scope.player.data('player')) {

            $scope.player.data('player').p.loadVideoByUrl("http://www.youtube.com/v/" + $scope.current.id + "?version=3")
            $scope.player.data('player').options.video = $scope.current.id

        } else {
            //  $("#video").replaceWith($('<iframe id="video" frameborder="0" allowfullscreen="1"  src="http://www.youtube.com/v/'+$scope.current.id+'"></iframe>'));

            Player = $scope.player = jQuery('#video').player({
                video: $scope.current.id,
                playerVars: {
                    'controls': 1,
                    'autoplay': 1
                },
                controls: 0,
                events: {
                    play: $scope.onPlay,
                    stop: $scope.onPause,
                    pause: $scope.onPause,
                    end: $scope.onEnd
                }
            });
        }

        ytVideo.player = $scope.player
    }
    $scope.start()
})

.controller('SearchCtrl', function ($rootScope, $scope, $ionicTabsDelegate, suggestFactory, ytVideo, $ionicModal, $state) {
    state = $state
    $scope.parola = ytVideo.parola
    $scope.downloader = downloader
    $scope.current = myIoSocket.current
    $scope.videos = ytVideo.videos
    $scope.suggerimenti = suggestFactory.suggerimenti
    $scope.storia = ytVideo.storia || []

    $('#video').addClass("noyt")

    $ionicModal.fromTemplateUrl('templates/search-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.modal = modal;

    });
    $scope.scaricato = function (video) {

        esistenti = _.filter(ytVideo.lista, function (v) {
            return v.id == video.id
        })
        return (esistenti.length == 0) ? false : true

    }
    $scope.minuti = function (secondi) {
        return (new Date()).clearTime().addSeconds(secondi).toString('mm:ss');
    }
    $scope.clicca = function (video) {
        if (event) event.preventDefault();
        if ($scope.cliccato && $scope.cliccato.id == video.id) {
            return $scope.cliccato = false
        }
        return $scope.cliccato = video
    }

    $scope.send_video = function (video) {
        if (event) event.preventDefault();
        return myIoSocket_send_video(video)
    }

    $scope.isremoto = function () {
        return (myIoSocket.remoto) ? true : false
    }

    $scope.openModal = function () {
        $scope.modal.show();
        //focus su cerca
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });

    $scope.suggerisci = function (key) {

        if (key == "") {
            $scope.suggerimenti = suggestFactory.suggerimenti = []
            return false;
        }
        if ($scope.timeout) clearTimeout($scope.timeout);
        $scope.timeout = setTimeout(function () {

            suggestFactory.getAsync(key, function (results) {
                $scope.suggerimenti = results[1];
                suggestFactory.suggerimenti = results[1];
            });

            if ($scope.timeout) clearTimeout($scope.timeout);


        }, 300);

    }
    $scope.down_video = function (video) {
        if (event) event.preventDefault();
        ytVideo.lista = (ytVideo.lista) ? ytVideo.lista : []
        esistenti = _.filter(ytVideo.lista, function (v) {
            return v.id == video.id
        })
        if (esistenti.length == 0) ytVideo.lista.push(video)
    }

    $scope.isplay = function () {
        if (getPlayer()) {
            return (getPlayer().getPlayerState() != 1) ? false : true

        }
        return false
    }
    $scope.select_play_video = function (video) {
        if (event) event.preventDefault();

        if (getPlayer() && myIoSocket.current.id == video.id) {

            if (Player.data('player').p.getPlayerState() == 1) {
                Player.data('player').p.pauseVideo()
            } else {
                if (Player.data('player').p.getPlayerState() != 1) {
                    Player.data('player').p.playVideo()
                }
            }
            return true
        }
        myIoSocket.current = video
        $scope.current = myIoSocket.current
        $state.go('tab.player')
    }

    $scope.cerca = function (key) {
        if (typeof (key) == "undefined" || key.length == 0) return false

        if ($scope.storia.indexOf(key) == -1) $scope.storia.push(key);
        ytVideo.storia = $scope.storia
        $scope.closeModal()
        $scope.inricerca = true
        $scope.parola = ytVideo.parola = key
        ytVideo.getAsync(key, function (results) {
            videos = _.filter(results.data.items, function (v) {
                return v.accessControl.embed == "allowed"
            })
            $scope.videos = videos;
            ytVideo.videos = videos;
            $scope.inricerca = false
        });
    }

})