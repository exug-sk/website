function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

(function() {
  "use strict";

	// Methods/polyfills.

	// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
	!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

	// canUse
	window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

	// window.addEventListener
	(function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

  // Vars.
  var $form = document.querySelectorAll('#signup-form')[0],
      $submit = document.querySelectorAll('#signup-form input[type="submit"]')[0],
      $email = document.querySelectorAll('#signup-form #email')[0],
      $message,
      $form_group = document.querySelectorAll('#signup-form .form-group')[0];

  //prefill email value if any
  $email.value = getParameterByName('email');

  // Bail if addEventListener isn't supported.
  if (!('addEventListener' in $form))
    return;

  // Message.
  $message = document.createElement('p');
  $message.classList.add('message');
  $form.appendChild($message);

  $message._show = function(type, text) {
    $message.innerHTML = text;
    $message.classList.add(type);
    $message.classList.add('visible');

    if (type=='error') {
      $message.classList.add('text-danger');
    }
    if (type=='success') {
      $message.classList.add('text-success');
    }

    window.setTimeout(function() {
      $message._hide();
    }, 3000);
  };

  $message._hide = function() {
    $message.classList.remove('visible');
  };

  Stamplay.init(stamplay_appid);
  // Events.
  // Note: If you're *not* using AJAX, get rid of this event listener.
  $form.addEventListener('submit', function(event) {
    console.log('submit');
    event.stopPropagation();
    event.preventDefault();

    // Hide message.
    $message._hide();

    // Disable submit.
    $submit.disabled = true;

    var webhook = new Stamplay.Webhook(stamplay_webhookid);

    var regExp = new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$");
    var valid = regExp.test($email.value);

    if (valid) {
      var data = { email: $email.value }
      webhook.post(data).then(function (response) {
        $form.reset();
        $submit.disabled = false;
        $form_group.classList.remove('has-warning');
        $message._show('success', 'Pozvánka je na ceste!');
      });
    } else {
        $form.reset();
        $submit.disabled = false;
        $form_group.classList.add('has-warning');
        $message._show('error', 'Prosím, vlož korektnú emailovú adresu.');
    }
  });

})();
