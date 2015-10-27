supersonic.ui.tabs.hide();
supersonic.ui.navigationBar.hide();

$(document).ready(function() {
    //Go back prev page or POP 
    $('.super-arrow-left-a').click(function() {
        supersonic.ui.layers.pop();
    });

    var $thisPageTitle = $('.page-title');
});

function notificationError(error) {
    alert('error = ' + error);
}

function messageInForegroundHandler(notification) {
    //handle the contents of the notification
    //alert(notification.message || notification.alert);
	var msg = notification.message || notification.alert;
	
    window.plugins.toast.showWithOptions({
            message: msg,
            duration: "long",
            position: "bottom",
            addPixelsY: -40 // added a negative value to move it up a bit (default 0)
        },
        null, // optional
        null // optional
    );
	
	if (msg.indexOf('begin') > -1) {
		var media = new Media("http://soundjax.com/reddo/40725%5EDING1.mp3", null, null);
		media.play();
		
		gameStart();
	}
	
    if (notification.sound) {
        var snd = new Media(notification.sound);
        snd.play();
    }

    if (notification.badge) {
        pushNotification.setApplicationIconBadgeNumber(function() {
            // success
        }, function() {
            // error
        }, notification.badge);
    }
}

function messageInBackgroundHandler(notification) {
    if (notification.coldstart) {
        // ios, this is always true
        // the application was started by the user tapping on the notification
    } else {
        //this notification was delived while the app was in background
    }

    //handle the contents of the notification
    //var message = notification.message || notification.alert;
    //alert(message);
}

function game(id) {
    var page;

    if (id == 1) {
        page = new steroids.views.WebView({
            location: "app/whoami/index.html"
        });
    } else if (id == 2) {
        page = new steroids.views.WebView({
            location: "app/likeaboss/index.html"
        });
    } else {
        page = new steroids.views.WebView({
            location: "app/truestory/index.html"
        });
    }

    var myAnimation = new steroids.Animation({
        transition: "slideFromRight",
        duration: 0.2,
        curve: "easeInOut",
        reversedTransition: "slideFromLeft",
        reversedDuration: 0.2
    });

    steroids.layers.push({
        view: page,
        keepLoading: false,
        navigationBar: false,
        tabBar: false,
        animation: myAnimation
    }, {
        onSuccess: function() {
            // alert("The view has been pushed to the layer stack.");
        },
        onFailure: function(error) {
            //  alert("Could not push the view: " + error.errorDescription);
        }
    });
}

function gameStart() {
	if (localStorage.getItem('game_id') == 2) {
		var play = JSON.parse(localStorage.getItem('play'));
		
		$.ajax({
			url: 'http://play.verygames.lol/'+play.room+play.pin+play.datetime_created+'.json',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				localforage.getItem('user', function(err, user) {
					if (data.dealer == user.user_id) {
						alert('you are the dealer! your action is '+data.action);
					}
					else {
						alert('you are NOT the dealer. deal with it!');
					}
				});
			},
			error: function(error) {
				//alert(JSON.stringify(error));
				window.plugins.toast.showWithOptions({
						message: "Sharks! We failed to start the game.",
						duration: "long",
						position: "bottom",
						addPixelsY: -40 // added a negative value to move it up a bit (default 0)
					},
					null, // optional
					null // optional
				);
			}
		});
	}
}