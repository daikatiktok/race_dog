function CSaveSlot() {

    var _bNumActive;

    var _oLevelTextContainer;
    var _aLevels = new Array();
    var _oModeNumOff;
    var _oModeNumOn;

    var _oBg;
    var _oBgWindows;
    var _oButExit;

    var _oFade;

    var _pStartPosExit;
    var _pStartPosAudio;
    
    var _pStartPosLocalSave;
    var _pStartPosOnlineSave;
    
    var _localSaveBtn;
    var _OnlineSaveBtn = null;
    var _loginBtn;
    var oSpriteLocalSave;
    
    var tempText1;
    var tempText2;
    var tempText3

    this._init = function () {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oBg.x = 0;
        _oBg.y = 0;
        s_oStage.addChild(_oBg);

        _bNumActive = false;

        _oBgWindows = createBitmap(s_oSpriteLibrary.getSprite('bg_saveWindows'));
        s_oStage.addChild(_oBgWindows);
        _oBgWindows.x =  (CANVAS_WIDTH/2)-270
        _oBgWindows.y =  (CANVAS_HEIGHT/2)-100
        var oButtonX;

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');
        oButtonX = CANVAS_WIDTH - (oSpriteExit.width / 2) - 200;
        _pStartPosExit = {x: oButtonX + 185, y: CANVAS_HEIGHT/2 - 210};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oSpriteLocalSave = s_oSpriteLibrary.getSprite('but_selectBtn');
        _pStartPosLocalSave = {x:  CANVAS_WIDTH/2 + 140, y:CANVAS_HEIGHT/2+240}
        _localSaveBtn = new CGfxButton(_pStartPosLocalSave.x, _pStartPosLocalSave.y, oSpriteLocalSave, s_oStage);
        _localSaveBtn.addEventListener(ON_MOUSE_UP, this._playLocal, this);
        
        _pStartPosOnlineSave = {x: CANVAS_WIDTH/2 - 150, y:CANVAS_HEIGHT/2+240}
        
        tempText1 = new createjs.Text("Login to use", "bold 38.58px " +FONT, "#FFFFFF")
        tempText1.textAlign = 'center';
        tempText2 = new createjs.Text("Online Save", "bold 38.58px " +FONT, "#FFFFFF")
        tempText2.textAlign = 'center';
        tempText1.x = CANVAS_WIDTH/2 - 140;
        tempText1.y = CANVAS_HEIGHT/2 + 30
        tempText2.x = tempText1.x
        tempText2.y = tempText1.y + 60
        s_oStage.addChild(tempText1)
        s_oStage.addChild(tempText2)
        tempText1.shadow = new createjs.Shadow("#000000", 1, 1, 1);
        tempText2.shadow = new createjs.Shadow("#000000", 1, 1, 1);
        
        tempText3 = new createjs.Text("Save Local\n in your\n computer", "bold 35px " + FONT, "#ffffff")
        tempText3.textAlign = 'center';
        tempText3.x = CANVAS_WIDTH/2 + 140
        tempText3.y = CANVAS_HEIGHT/2 
        s_oStage.addChild(tempText3)
        tempText3.shadow = new createjs.Shadow("#000000", 1, 1, 1);
        console.log('s_isLogin ' + s_isLogin)
        if(s_isLogin === true)
        {
            tempText1.text = 'Welcome'
            tempText2.text = s_userName
            _OnlineSaveBtn = new CGfxButton(_pStartPosOnlineSave.x, _pStartPosOnlineSave.y, oSpriteLocalSave, s_oStage);
            _OnlineSaveBtn.addEventListener(ON_MOUSE_UP, this._playOnline, this);
        }
        else
        {
            
            var oSpriteLogin = s_oSpriteLibrary.getSprite('but_LoginBtn');
            _loginBtn = new CGfxButton(_pStartPosOnlineSave.x, _pStartPosOnlineSave.y, oSpriteLogin, s_oStage);
            _loginBtn.addEventListener(ON_MOUSE_UP, this._Login, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            s_oStage.removeChild(_oFade);
        });

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

    };

    this.unload = function () {
        
        s_oSaveSlot = null;
        s_oStage.removeAllChildren();
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
         _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
    };


    this._onExit = function () {
        //createjs.Sound.stop();
        s_oSaveSlot.unload();
        s_oMain.gotoMenu();
    };
    
    this._playLocal = function(){
        createjs.Sound.play("click");
        console.log('Play Game Local')
        s_localSave = true
        s_onlineSave = false
        this.unload()
        loadData()
        //s_oMain.gotoLevelMenu();
    }
    
    this._playOnline = function()
    {
        createjs.Sound.play("click");
        console.log('Play Game Online')
        s_localSave = false
        s_onlineSave = true
        this.removeListeners()
        loadData()
        //s_oMain.gotoLevelMenu();
    }
    
    this.removeListeners = function()
    {
        s_oStage.removeChild(tempText1)
        s_oStage.removeChild(tempText2)
        s_oStage.removeChild(tempText3)
        s_oStage.removeChild(_oBgWindows)
        _OnlineSaveBtn.unload()
        _OnlineSaveBtn = null;
        _localSaveBtn.unload()
        _oButExit.unload()
        var tempText4 = new createjs.Text("Loading, Please Wait ", "bold 40px "+ FONT, "#FFFFFF")
        tempText4.textAlign = 'center';
        tempText4.x = CANVAS_WIDTH/2;
        tempText4.y = CANVAS_HEIGHT/2 + 200;
        tempText4.shadow = new createjs.Shadow("#000000", 1, 1, 10);
        s_oStage.addChild(tempText4);
        
    }
    this._Login = function()
    {
        console.log('Login')
        ID.login(this.idCallback);
    }
    
    this.idCallback = function(response){
          if (response) { // That means that the server processed the response
          if(response.status === 'ok')
           {
             userName = response.authResponse.details.nickname;
             s_oMain.getUserName(userName,true)
           }
           else
           {
             ID.login(idCallback);
           }
         }
     }
    
    this.createOnlineSaveBtn = function()
    {
        console.log('createOnlineSaveBtn')
        _loginBtn.unload()
        tempText1.text = 'Welcome'
        tempText2.text = s_userName
        if(_OnlineSaveBtn === null)
        {
            _OnlineSaveBtn = new CGfxButton(_pStartPosOnlineSave.x, _pStartPosOnlineSave.y, oSpriteLocalSave, s_oStage);
        }
        _OnlineSaveBtn.addEventListener(ON_MOUSE_UP, this._playOnline, this);
    }


    s_oSaveSlot = this;
    this._init();

}
;

var s_oSaveSlot = null;