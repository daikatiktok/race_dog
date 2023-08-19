function CLosePanel(oParentContainer){
    var _iWidthBib;
    var _iHeightBib;
    var _aBibs;
    var _oSpriteSheetBib;
    
    var _oButSkip;
    var _oWinText;
    var _oContainer;
    var _oParentContainer;
    
    var _LeaderBoardSprite;
    var _pLeaderBoardBtn;
    var _oLeaderBoardBtn = null;
    var _oLeaderBoardBtn1 = null;
    
    var _totMoney;
    var oText
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("lose_panel"));
        _oContainer.addChild(oBg);
        
        oText = new createjs.Text(TEXT_NO_WIN, "50px " + PRIMARY_FONT, "#fff");
        oText.textAlign = "center";
        oText.textBaseline = "alphabetic";
        oText.x = CANVAS_WIDTH/2;
        oText.y = 285;
        _oContainer.addChild(oText);
        
        
        var oSprite = s_oSpriteLibrary.getSprite("bibs");
        _iWidthBib = oSprite.width/3;
        _iHeightBib = oSprite.height/2;
        
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: _iWidthBib, height: _iHeightBib},
            animations: {bib_0: [0], bib_1: [1],bib_2:[2],bib_3:[3],bib_4:[4],bib_5:[5]}
        };

        _oSpriteSheetBib = new createjs.SpriteSheet(oData);
        
        _aBibs = new Array();
        var oBib1 = createSprite(_oSpriteSheetBib,"bib_0",0,0,_iWidthBib,_iHeightBib);
        oBib1.x = CANVAS_WIDTH/2 - 100 - _iWidthBib/2;
        oBib1.y = 350;
        _oContainer.addChild(oBib1);
        
        _aBibs.push(oBib1);
        
        var oBib2 = createSprite(_oSpriteSheetBib,"bib_0",0,0,_iWidthBib,_iHeightBib);
        oBib2.x = CANVAS_WIDTH/2 - _iWidthBib/2;
        oBib2.y = 350;
        _oContainer.addChild(oBib2);
        
        _aBibs.push(oBib2);
        
        var oBib3 = createSprite(_oSpriteSheetBib,"bib_0",0,0,_iWidthBib,_iHeightBib);
        oBib3.x = CANVAS_WIDTH/2 + 100 - _iWidthBib/2;
        oBib3.y = 350;
        _oContainer.addChild(oBib3);
        
        _aBibs.push(oBib3);
        
        _oWinText = new createjs.Text(TEXT_WIN + ": 0.00 " + TEXT_CURRENCY, "30px " + PRIMARY_FONT, "#fff");
        _oWinText.textAlign = "center";
        _oWinText.textBaseline = "alphabetic";
        _oWinText.x = CANVAS_WIDTH/2;
        _oWinText.y = 470;
        _oContainer.addChild(_oWinText);
        
        _totMoney = new createjs.Text(TEXT_WIN, "30px " + PRIMARY_FONT, "#fff");
        _totMoney.textAlign = "center";
        _totMoney.textBaseline = "alphabetic";
        _totMoney.x = CANVAS_WIDTH/2;
        _totMoney.y = 510;
        _totMoney.lineHeight = 42;
        _oContainer.addChild(_totMoney);
        
        _oButSkip = new CGfxButton(CANVAS_WIDTH/2+100,591,s_oSpriteLibrary.getSprite("but_skip"),_oContainer);
        _oButSkip.addEventListener(ON_MOUSE_UP,this.onSkip,this);
        
        if(s_isLogin === false)
        {
            this.createSubmitScoreBtn()
        }
        else
        {
            this.createLeaderboardBtn()
        }
    };
    
    this.createSubmitScoreBtn = function()
    {
        var oSprite = s_oSpriteLibrary.getSprite('but_submit_score');
        _pLeaderBoardBtn = {x: CANVAS_WIDTH/2-100, y: 591};         
       _oLeaderBoardBtn1 = new CGfxButton(_pLeaderBoardBtn.x,_pLeaderBoardBtn.y,oSprite,_oContainer);
       _oLeaderBoardBtn1.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
    }
    this.createLeaderboardBtn = function()
    {
        trace('createLeaderboardBtn')
        var oSprite = s_oSpriteLibrary.getSprite('but_leaderboard_End');
        _pLeaderBoardBtn = {x: CANVAS_WIDTH/2-100, y: 591};           
       _oLeaderBoardBtn = new CGfxButton(_pLeaderBoardBtn.x,_pLeaderBoardBtn.y,oSprite,_oContainer);
       _oLeaderBoardBtn.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
       trace('_oLeaderBoardBtnX ' + _oLeaderBoardBtn.x)
       trace('_oLeaderBoardBtnY ' + _oLeaderBoardBtn.y)
    }
    
    this._showLeaderboard = function()
    {
        console.log('_showLeaderboard')
        if(s_isLogin === false)
        {
            this._onLoginClicked()
        }
        else
        {
            ID.GameAPI.Leaderboards.list({table:"Leaderboard"})
        } 
    }
    
    this._onLoginClicked = function () {
            ID.login(this.idCallback);
    };
    
    this.idCallback = function(response){
          if (response) {
          if(response.status === 'ok')
           {
              _oLeaderBoardBtn1.unload()
               s_oEndPanel1.createLeaderboardBtn()
              s_oMain.getUserName(response.authResponse.details.nickname, true)
              s_oMain.submitScore(s_iCurMoney)
           }
           else
           {
             ID.login(this.idCallback);
           }
         }
     }
    
    this.unload = function(){
        if(s_isLogin === false)
         {
             if(_oLeaderBoardBtn1 != null)
             {
                 _oLeaderBoardBtn1.unload()
                 _oLeaderBoardBtn1 = null;
             }
         }
         else
         {
             if(_oLeaderBoardBtn != null)
             {
                 _oLeaderBoardBtn.unload()
                 _oLeaderBoardBtn = null
             }
             
         }
        _oButSkip.unload();
    };
    
    this.show = function(aRank){
        _totMoney.text = "MONEY " +s_iCurMoney+TEXT_CURRENCY;
        s_oMain.submitScore(s_iCurMoney)
        for(var j=0;j<3;j++){
             _aBibs[j].gotoAndStop("bib_"+aRank[j]);
        }
         
        _oContainer.visible = true;
        _oContainer.alpha = 0;
        createjs.Tween.get(_oContainer).wait(1000).to({alpha: 1}, 500,createjs.Ease.cubicOut);
        if(s_iCurMoney < 1)
        {
            trace('TT')
            oText.text = "GAME OVER"
        }
        s_oMain.createY8Logo("g_menulogo", CANVAS_WIDTH/2, CANVAS_HEIGHT-80)
        this.refreshButtonPos();
    };
    
    this.refreshButtonPos = function () {
        s_oMain.logoReposition(s_iOffsetX+CANVAS_WIDTH/2, (40) + s_iOffsetY)
    }
    
    this.onSkip = function(){ 
        console.log('onSkip Lose')
        if(s_iCurMoney >= 1)
        {
            s_oMain.removeY8Logo();
            s_oGame.returnInBetPanel();
        }
        else
        {
            s_iCurMoney = 100;
            s_oMain.gotoMenu();
        }
        s_oEndPanel1 = null
        try {
        console.log('Showing Ads')
        nextAds()
        }
        catch (e) {
            console.log(e + ' Error Showing Ads')
            showMessage()
        }
        
    };
    
    _oParentContainer = oParentContainer;
    s_oEndPanel1 = this;
    this._init();
    
}

var s_oEndPanel1 = null;