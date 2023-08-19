function CMenu() {
    var _oBg;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oButCredits;
    var _oCreditsPanel = null;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oLogo;
    
    var _pStartPosPlay;
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    var _pStartPosLogo;
    
     var _pLeaderboardBtn;
    var _oLeaderboardBtn;
    
    this._init = function () {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        var oSpritePlay = s_oSpriteLibrary.getSprite('but_play');
        _pStartPosPlay = {x:CANVAS_WIDTH/2,y:CANVAS_HEIGHT - oSpritePlay.height/2 - 10};
        _oButPlay = new CGfxButton(_pStartPosPlay.x, _pStartPosPlay.y, oSpritePlay);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        
        s_oMain.createY8Logo("g_menulogo", 320, CANVAS_HEIGHT-40)
        
        var oSprite = s_oSpriteLibrary.getSprite('but_leaderboard');
        _pLeaderboardBtn = {x: CANVAS_WIDTH - (oSprite.height+oSprite.height/2) - 20, y: (oSprite.height/2) + 10};            
        _oLeaderboardBtn = new CGfxButton(_pLeaderboardBtn.x,_pLeaderboardBtn.y,oSprite,s_oStage);
        _oLeaderboardBtn.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        if(SHOW_CREDITS){
            _pStartPosCredits = {x:10 + oSprite.width/2,y:(oSprite.height / 2) + 10};
            _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSprite);
            _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);
            
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width + 10,y:_pStartPosCredits.y};
        }else{
            _pStartPosFullscreen = {x:10 + oSprite.width/2,y:(oSprite.height / 2) + 10};
        }
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - oSprite.width/4 -10, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && inIframe() === false){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        
        var oSpriteLogo = s_oSpriteLibrary.getSprite("logo_menu");
        _pStartPosLogo = {x:CANVAS_WIDTH/2,y:10};
        _oLogo = createBitmap(oSpriteLogo);
        _oLogo.regX = oSpriteLogo.width/2;
        _oLogo.x = _pStartPosLogo.x;
        _oLogo.y = _pStartPosLogo.y;
        s_oStage.addChild(_oLogo);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            s_oStage.removeChild(_oFade);
        });
        
        _loginText = new createjs.Text("","bold 30px "+PRIMARY_FONT, "#FFE002");
        _loginText.shadow = new createjs.Shadow("#450000", 1, 1, 1);
        _loginText.x =  CANVAS_WIDTH/2;
        _loginText.y =  CANVAS_HEIGHT/2-240;
        _loginText.textBaseline = "alphabetic";
        _loginText.lineWidth = 500;
        _loginText.text = "Welcome Guest";
        _loginText.textAlign = 'right';
        _textGroup = new createjs.Container();
        _textGroup.alpha = 1;
        _textGroup.visible=true;        
        _textGroup.addChild(_loginText);
        s_oStage.addChild(_textGroup);
        
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

     this.getUserName = function () {
        if(s_isLogin===true){
            _loginText.text = 'Welcome '+s_userName;
        }else{
            _loginText.text = "Welcome Guest";
        }
    };
    
    this._showLeaderboard = function()
    {
        console.log('_showLeaderboard')
        ID.GameAPI.Leaderboards.list({table:'Leaderboard', mode:'newest'})
    }
    
    this.unload = function () {
        _oButPlay.unload();
        _oButPlay = null;
        
        if(SHOW_CREDITS){
            _oButCredits.unload();
        }
        
        s_oStage.removeChild(_oBg);
        _oBg = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.unload();
        }
        s_oMenu = null;
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
        
        _oButPlay.setPosition(_pStartPosPlay.x,_pStartPosPlay.y - iNewY);
        if(SHOW_CREDITS){
            _oButCredits.setPosition(_pStartPosCredits.x + iNewX,_pStartPosCredits.y + iNewY);
        }
        
        
        if(_oCreditsPanel !== null){
            _oCreditsPanel.refreshButtonPos(iNewX, iNewY);
        }
        
        _oLogo.y = _pStartPosLogo.y + iNewY;
         _oLeaderboardBtn.setPosition(_pLeaderboardBtn.x - iNewX,_pLeaderboardBtn.y + iNewY);
        s_oMain.logoReposition(iNewX+70, (CANVAS_HEIGHT-40) - iNewY)
                
        _loginText.x =  CANVAS_WIDTH - 20
        _loginText.y =  (CANVAS_HEIGHT-20) - iNewY;
    };
    
    this.exitFromCredits = function(){
        _oCreditsPanel = null;
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onCredits = function(){
        _oCreditsPanel = new CCreditsPanel();
    };

    this._onButPlayRelease = function () {
        this.unload();

        s_oMain.gotoBetPanel();
        try {
        console.log('Showing Ads')
        nextAds()
        }
        catch (e) {
            console.log(e + ' Error Showing Ads')
            showMessage()
        }
        if (isIOS() && s_oSoundTrack === null) {
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundTrack = playSound("soundtrack", 1,true);
            }
        }
    };
    
    this.resetFullscreenBut = function(){
	_oButFullscreen.setActive(s_bFullscreen);
    };

    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    s_oMenu = this;

    this._init();
}

var s_oMenu = null;