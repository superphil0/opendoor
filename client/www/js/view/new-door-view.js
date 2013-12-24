// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app.NewDoorView = (function(_super) {
    __extends(NewDoorView, _super);

    function NewDoorView() {
      _ref = NewDoorView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewDoorView.prototype.model = app.model;

    NewDoorView.prototype.template = Handlebars.compile($("#new-door-template").html());

    NewDoorView.prototype.events = {
      "click #login-btn": "loginClicked",
      "click #back-btn": "backClicked",
      "click #https": "setHttps",
      "click #http": "setHttp"
    };

    NewDoorView.prototype.initialize = function() {
      return this.render();
    };

    NewDoorView.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      if (this.model.get("prot") === "https://") {
        return this.setHttps();
      } else {
        return this.setHttp();
      }
    };

    NewDoorView.prototype.loginClicked = function() {
      var deviceId, doorUrl, passphrase,
        _this = this;
      doorUrl = this.model.get("prot") + this.$("#door-url").val();
      passphrase = this.$("#passphrase").val();
      deviceId = window.device ? window.device.uuid : "itsme";
      this.$("#new-door-brand").html('<div class="loading spin"></div>');
      this.$(".form-group").removeClass("has-error");
      return $.ajax({
        url: "" + doorUrl + "/login?passphrase=" + passphrase + "&deviceId=" + deviceId,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        statusCode: {
          401: function(resp) {
            return _this.$(".pass-form-group").addClass("has-error");
          },
          404: function(resp) {
            return _this.$(".door-form-group").addClass("has-error");
          }
        },
        error: function(err) {
          return _this.$(".navbar-brand").text(err.status);
        },
        success: function(resp) {
          var doorUrls;
          if (!resp.hasOwnProperty("token")) {
            return _this.$("#new-door-brand").text("500");
          } else {
            _this.$("#new-door-brand").text("Add a door");
            _this.$("#door-url").val("");
            _this.$("#passphrase").val("");
            doorUrls = _this.model.get("doorUrls");
            if (!_.contains(doorUrls, doorUrl)) {
              doorUrls.push(doorUrl);
              localStorage.setItem("doorUrls", JSON.stringify(doorUrls));
              localStorage.setItem(doorUrl, resp.token);
            }
            _this.setHttps();
            return _this.model.set({
              doorUrl: doorUrl,
              page: "openDoor",
              disabled: "",
              prot: "https://"
            });
          }
        }
      });
    };

    NewDoorView.prototype.backClicked = function() {
      return this.model.set("page", "openDoor");
    };

    NewDoorView.prototype.setHttps = function() {
      this.$("#prot-text").text("https://").parent().removeClass("btn-danger");
      return this.model.set("prot", "https://");
    };

    NewDoorView.prototype.setHttp = function() {
      this.$("#prot-text").text("http://").parent().addClass("btn-danger");
      return this.model.set("prot", "http://");
    };

    return NewDoorView;

  })(Backbone.View);

}).call(this);
