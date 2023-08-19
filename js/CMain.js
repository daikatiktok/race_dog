function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oGame;

    this.initContainer = function () {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
	s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);

        s_bMobile = jQuery.browser.mobile;
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function (e) {
                return false;
            });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(FPS);

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
        this.getLocation()
    };

    this.preloaderReady = function () {
        jQuery.getJSON("greyhound_info.json", this.onLoadedJSON); 
        _bUpdate = true;
    };
    
    this.onLoadedJSON = function (oData) {
        s_oGameSettings = new CGameSettings(oData);
        s_oBetList = new CBetList();
        
        s_oMain._loadImages();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            s_oMain._initSounds();
        }
    };
    
    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            this._onRemovePreloader();
        }
    };
    
    this._initSounds = function(){
    
        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: './sounds/',filename:'chip',loop:false,volume:1, ingamename: 'chip'});
        aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        aSoundsInfo.push({path: './sounds/',filename:'start_race',loop:false,volume:1, ingamename: 'start_race'});
        aSoundsInfo.push({path: './sounds/',filename:'photo',loop:false,volume:1, ingamename: 'photo'});
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        
        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({ 
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3', aSoundsInfo[i].path+aSoundsInfo[i].filename+'.ogg'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop, 
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded()
                                                        });
        }
        
    };  

    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("arrow_left", "./sprites/arrow_left.png");
        s_oSpriteLibrary.addSprite("arrow_right", "./sprites/arrow_right.png");
        s_oSpriteLibrary.addSprite("fiche_0", "./sprites/fiche_0.png");
        s_oSpriteLibrary.addSprite("fiche_1", "./sprites/fiche_1.png");
        s_oSpriteLibrary.addSprite("fiche_2", "./sprites/fiche_2.png");
        s_oSpriteLibrary.addSprite("fiche_3", "./sprites/fiche_3.png");
        s_oSpriteLibrary.addSprite("fiche_4", "./sprites/fiche_4.png");
        s_oSpriteLibrary.addSprite("fiche_5", "./sprites/fiche_5.png");
        s_oSpriteLibrary.addSprite("bg_bet_panel", "./sprites/bg_bet_panel.jpg");
        s_oSpriteLibrary.addSprite("money_panel", "./sprites/money_panel.png");
        s_oSpriteLibrary.addSprite("simple_bet_panel", "./sprites/simple_bet_panel.png");
        s_oSpriteLibrary.addSprite("forecast_panel", "./sprites/forecast_panel.png");
        s_oSpriteLibrary.addSprite("bet_place", "./sprites/bet_place.png");
        s_oSpriteLibrary.addSprite("fiche_highlight", "./sprites/fiche_highlight.png");
        s_oSpriteLibrary.addSprite("odd_bg", "./sprites/odd_bg.png");
        s_oSpriteLibrary.addSprite("rank_panel", "./sprites/rank_panel.png");
        s_oSpriteLibrary.addSprite("panel_arrival", "./sprites/panel_arrival.png");
        s_oSpriteLibrary.addSprite("bibs", "./sprites/bibs.png");
        s_oSpriteLibrary.addSprite("but_skip", "./sprites/but_skip.png");
        s_oSpriteLibrary.addSprite("logo_menu", "./sprites/logo_menu.png");
        s_oSpriteLibrary.addSprite("but_start_race", "./sprites/but_start_race.png");
        s_oSpriteLibrary.addSprite("but_clear_bet", "./sprites/but_clear_bet.png");
        s_oSpriteLibrary.addSprite("fiche_panel", "./sprites/fiche_panel.png");
        s_oSpriteLibrary.addSprite("fill_bar", "./sprites/fill_bar.png");
        s_oSpriteLibrary.addSprite("win_panel", "./sprites/win_panel.png");
        s_oSpriteLibrary.addSprite("lose_panel", "./sprites/lose_panel.png");
        
        s_oSpriteLibrary.addSprite("y8logo","./sprites/y8logo.png");
        s_oSpriteLibrary.addSprite("but_leaderboard","./sprites/leaderBoar_Btn.png");
        s_oSpriteLibrary.addSprite("but_leaderboard_End","./sprites/leaderBoar_Btn_med.png");
        s_oSpriteLibrary.addSprite("but_submit_score","./sprites/submit_score.png");
        s_oSpriteLibrary.addSprite("adv_message","./sprites/adv_message.png");
        
        for(var i=0;i<NUM_GREYHOUNDS;i++){
            s_oSpriteLibrary.addSprite("bib_gui_"+i, "./sprites/bib_gui_"+i+".png");
            s_oSpriteLibrary.addSprite("greyhound_"+(i+1), "./sprites/greyhound_"+(i+1)+".png");
        }
        
        for(var j=0;j<NUM_TRACK_BG;j++){
            s_oSpriteLibrary.addSprite("bg_track_"+j, "./sprites/bg_track/bg_track_"+j+".jpg");
        }
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
        
        if (_iCurResource === RESOURCE_TO_LOAD) {
            this._onRemovePreloader();
        }
    };

    this._onAllImagesLoaded = function () {
        
    };

    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages();
    };
    
    this._onRemovePreloader = function(){
        try{
            saveItem("ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }
        
        _oPreloader.unload();

        if (!isIOS()) {
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundTrack = playSound("soundtrack", 1,true);
            }
        }
        

        this.gotoMenu();
    };
    
    this.gotoMenu = function () {
        if(s_iCurMoney < 1)
        {
            s_iCurMoney = 100;
        }
        _oMenu = new CMenu();
        _iState = STATE_MENU;
        this.getUserName(s_userName, s_isLogin);
    };
    
    this.gotoBetPanel = function(){
        new CBetPanel();
        _iState = STATE_BET_PANEL;
        $(s_oMain).trigger("start_session");
    };
    
    this.gotoGame = function (_iTotBet) {
        _oGame = new CGame(_iTotBet);
        _iState = STATE_GAME;
    };

    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        if(isAdShowing === false)
        {
            s_iPrevTime = new Date().getTime();
            _bUpdate = true;
            createjs.Ticker.paused = false;
            $("#block_game").css("display","none");

            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                if(s_bAudioActive){
                    Howler.mute(false);
                }
            }
        }
        
    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);

    };
    
    /********************Id net and Branding Functions***************/
     this.createY8Logo = function(str, posX, posY, alphaTween)
    {
       var y8logoMc = s_oSpriteLibrary.getSprite('y8logo');
       s_y8logo = new Y8logo(posX, posY, y8logoMc, str);
    };
    
    this.removeY8Logo = function(str)
    {
       s_y8logo.unload();
       s_y8logo = null;
    };
    
    this.logoReposition = function(intX, intY)
    {
        if(s_y8logo != null)
        {
            s_y8logo.setX(intX)
            s_y8logo.setY(intY)
        }
       
    };
    
    this.ShowY8Anim = function(act)
    {
        if(act === true)
        {
           s_y8logo.showAnim(); 
        }
        else
        {
           s_y8logo.removeAnim();
        }
        
    };
    
    this.getUserName = function(_getUserName,_flag){
        s_isLogin = _flag;
        s_userName = _getUserName;
        if(_iState === STATE_MENU && s_isBlacklisted === false)
        {
             _oMenu.getUserName();
        }
        console.log('username : ',_getUserName);
    };
    this.getLocation = function()
    {
            s_URLlocation = self.location.hostname
            console.log('URLlocation: ' + s_URLlocation)
    }
    this.sponsorStatus = function (_getSponsorStatus) {
       s_sponsor = _getSponsorStatus
       if(_iState === STATE_LOADING && s_isBlacklisted === false && s_sponsor === true){s_y8logo.removeListeners()}
       if(_iState === STATE_MENU && s_isBlacklisted === false && s_sponsor === true){s_y8logo.removeListeners()} 
    };
    
    this.blackListState = function (_blackliststate) {
        //console.log('blackListState ')
       
        if(_blackliststate){
            var blacklisted = CBlacklist(_iState, s_gameName);
            s_isBlacklisted = true
        }
    };
    
    this.unloadScreens = function(scr)
    {
        if(scr === STATE_MENU && s_oMenu != null){
           console.log('_oMenu ' + _oMenu); _oMenu.unload()
        }
        if(scr === STATE_LOADING){
            _oPreloader.unload()
        }
        if(scr === STATE_GAME){
            _oGame.unload()
        }
    }
    
    this.submitScore = function(_iScore)
    { 
        console.log('s_isLogin ' + s_isLogin)
        console.log('submitScore ' + _iScore)
        if(s_isLogin === true){
        ID.GameAPI.Leaderboards.save({'table':'Leaderboard','points':_iScore});
        }
    }
    
    this.gotoLoginWindows = function () {
        console.log('gotoLoginWindows ')
        _iState = STATE_SAVESLOTS
        _oSaveSlot = new CSaveSlot();
    };
    
    /*********************************************************************/
    
    s_oMain = this;

    _oData = oData;
    s_iCurMoney = oData.money;
    s_iGameCash = oData.game_cash;
    CHIP_VALUES = oData.chip_values;
    MIN_BET = oData.min_bet;
    MAX_BET = oData.max_bet;
    WIN_OCCURRENCE = oData.win_occurrence;
    AD_SHOW_COUNTER = oData.num_levels_for_ads;
    
    SHOW_CREDITS = oData.show_credits;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    
    NUM_CHIPS = CHIP_VALUES.length;

    this.initContainer();
}

function showMessage()
{
    console.log('showMessage')
    isAdBlock = true;
    var oSprite = s_oSpriteLibrary.getSprite('adv_message');
    var messBox = createBitmap(oSprite);
    s_oStage.addChild(messBox);
    messBox.regX = oSprite.width/2;
    messBox.regY = oSprite.height/2;
    messBox.x = CANVAS_WIDTH/2;
    messBox.y = CANVAS_HEIGHT/2;
    messBox.addEventListener("click", function(){
            console.log('messBox click')
           s_oStage.removeChild(messBox);
           messBox = null;
           oSprite = null;
    })
}

var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_oCanvas;
var s_bStorageAvailable = true;
var s_iCurMoney;
var s_iGameCash;
var s_iAdCounter = 0;
var s_aSounds;

//Id net variables
var s_isLogin = false;
var s_userName = 'guest';
var s_URLlocation;
var s_gameName = "Greyhound_racing"
var s_isBlacklisted = false
var isTutorial = false
var s_y8logo;
    
var s_sponsor = false;
var s_iScore;

var isFirstAdPlayed = false;
var isAdShowing = false;
var isAdBlock = false;