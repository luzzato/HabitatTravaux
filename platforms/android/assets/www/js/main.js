/*******************************************************************************
 * Registering device for push notifications according to platform
 * 
 * @author Rajkumari Parihar
 ******************************************************************************/
var pushNotification;

function registerPush() {
	try {
		pushNotification = window.plugins.pushNotification;
		if (device.platform == 'android' || device.platform == 'Android') {
			// alert('Android');
			pushNotification.register(successHandler, errorHandler, {
				"senderID" : "1047920388985",
				"ecb" : "onNotificationGCM"
			});
		} else {
			pushNotification.register(tokenHandler, errorHandler, {
				"badge" : "true",
				"sound" : "true",
				"alert" : "true",
				"ecb" : "onNotificationAPN"
			});
		}
	} catch (err) {
		txt = "There was an error on this page.\n\n";
		txt += "Error description: " + err.message + "\n\n";
	}

}

function onNotificationAPN(e) {
	if (e.alert) {
		navigator.notification.alert(e.alert);
	}

	if (e.sound) {
		var snd = new Media(e.sound);
		snd.play();
	}

	if (e.badge) {
		pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
	}
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
	switch (e.event) {
	case 'registered':
		if (e.regid.length > 0) {
			// alert('registration id = ' + e.regid);
			// Your GCM push server needs to know the regID before it can push
			// to this device
			// here is where you might want to send it the regID for later use.
			// alert("regID = " + e.regid);
			// send registration

			console.log('registration id = ' + e.regid)
			$.ajax({
				type : "POST",
				url : "http://azurabiz.com/HabitatPush/api/server.php",
				data : "action=registerandroid&device_id=" + e.regid,
				success : function(data, textStatus, jqXHR) {
					console.log("success.>>>>>");

					// alert("Success"+JSON.stringify(data));
					console.log("Success" + JSON.stringify(data));
				},
				error : function(data, textStatus, jqXHR) {
					console.log("errrrrrrr" + JSON.stringify(data)
							+ "textStatus" + textStatus);

					// alert("errrrrrrr"+JSON.stringify(data) +"textStatus"
					// +textStatus);

				}
			});
		}
		break;

	case 'message':

		// alert('message = '+e.message+' msgcnt = '+e.msgcnt);
		// if this flag is set, this notification happened while we were in the
		// foreground.
		// you might want to play a sound to get the user's attention, throw up
		// a dialog, etc.
		if (e.foreground) {
			// if the notification contains a soundname, play it.
			// var my_media = new Media("/android_asset/www/"+e.soundname);
			// my_media.play();
		} else { // otherwise we were launched because the user touched a
			// notification in the notification tray.
			// if (e.coldstart)
			// $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' +
			// '</li>');
			// else
			// $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' +
			// '</li>');
		}
		// navigator.notification.alert(e.payload.message);

		navigator.notification.alert(e.payload.message, // message
		alertDismissed, // callback
		'Cannes Echecs', // title
		'Ok' // buttonName
		);

		function alertDismissed() {
			// do something
		}

		break;

	case 'error':
		// alert("i error " + e.msg);
		break;

	default:
		// alert("i default ");
		break;
	}
}

function tokenHandler(result) {
	// Your iOS push server needs to know the token before it can push to this
	// device
	// here is where you might want to send it the token for later use.
	if (!result)
		return;

	$.ajax({
		type : "POST",
		url : "http://azurabiz.com/HabitatPush/api/server.php",
		data : "action=registerios&device_token=" + result,
		success : function(data, textStatus, jqXHR) {

			console.log("Success" + JSON.stringify(data));
			// alert("Success"+data);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("errrrrrrr" + JSON.stringify(data) + "textStatus"
					+ textStatus);

		}
	});
}

function successHandler(result) {

}

function errorHandler(error) {

}

