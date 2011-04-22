function MainAssistant() {
}

MainAssistant.prototype.setup = function() { //construtor
	AdMob.ad.initialize({ //seta o ad admob
		pub_id: 'a14c464f24e2634',
		bg_color: 'transparent',
		text_color: '#ffffff',
		ad_request: true,
		test_mode: false
	});
	
	AdMob.ad.request({ //inicializa o admob ad
		onSuccess: (function (ad) {
			this.controller.get('admob_ad').insert(ad);
		}).bind(this),
		onFailure: (function () {
			//document.getElementById('admob_ad').innerHTML = 'ad here';
		}).bind(this)
	});
	
	if(Mojo.Environment.DeviceInfo.screenHeight == 400){ //se Palm Pixi...
		document.getElementById('info').innerHTML = '<a href="http://www.arcticapps.com/">Arctic Apps. Know our mobile applications.</a>';
		document.getElementById('info').style.top = '188px';
		/*document.getElementById('admob_ad').style.top = '142px';
		document.getElementById('entrada').style.top = '196px';
		document.getElementById('saida').style.top = '151px';
		document.getElementById('loading').style.top = '206px';
		document.getElementById('shorten').style.top = '188px';
		document.getElementById('copy').style.top = '143px';
		document.getElementById('clean').style.top = '203px';
		document.getElementById('cancel').style.top = '188px';*/
	}
	
	document.getElementById('loading').style.visibility = "hidden"; //'Shortening url...' fica escondido no HTML
	document.getElementById('cancel').style.visibility = "hidden"; //botao 'cancel' fica escondido no HTML
	
	this.controller.setupWidget('shorten', {}, {buttonLabel: 'go!'}); //setando o botao go!
	this.controller.setupWidget('copy', {}, {buttonLabel: 'copy'}); //setando o botao botao paste
	this.controller.setupWidget('cancel', {}, {buttonLabel: 'cancel'}); //setando o botao cancel
	
	this.radioAttributes = { //atributos do radioButton (no HTML)
		choices: [ //seriços a disposicao do user:
			{label : 'u.nu', value : 'http://u.nu/unu-api-simple?url='},
			{label : 'is.gd', value : 'http://is.gd/api.php?longurl='},
			{label : 'bit.ly', value : 'http://api.bit.ly/v3/shorten?login=arcticapps&apiKey=R_5e1aaadd44eb2269e44198cd92a971c3&format=txt&longUrl='}
			
		]
	}

	this.radioModel = { //modelo do radioButton (no HTML)
		value : 'http://u.nu/unu-api-simple?url=',
		disabled:false
	}
	
	//escolha servicos pelo user
	this.controller.setupWidget('radioButton', this.radioAttributes,this.radioModel ); //associa os atributos e modelo ao radioButton no HTML
	
	//go!
	this.cancel = this.cancel.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('cancel'),Mojo.Event.tap,this.cancel); //associa o evento 'propertyChange' ao radioButton no HTML
	
	//cancel!
	this.shortener = this.shortener.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('shorten'),Mojo.Event.tap,this.shortener); //associa o evento 'propertyChange' ao radioButton no HTML
	
	//paste
	this.copy = this.copy.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('copy'),Mojo.Event.tap,this.copy); //associa o evento 'tap' ao botao COPY no HTML
	
	//clean input
	this.clean = this.clean.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('clean'),Mojo.Event.tap,this.clean); //associa o evento 'tap' ao botao COPY no HTML
	
	this.controller.setupWidget(Mojo.Menu.appMenu,{ omitDefaultItems: true },{
        visible: true,
        items: [ 
            Mojo.Menu.editItem,
            { label: "Preferences...", command: 'do-myPrefs' },
            { label: "Help...", command: 'do-myHelp' }
        ]
    } ); //Por default, existe um APP MENU com HELP e PREFERENCES. Mas vamos omitir esse menu
}

MainAssistant.prototype.handleCommand = function(event) {
	if (event.type === Mojo.Event.command) {
        switch (event.command) {
            case 'do-myPrefs': this.controller.stageController.pushScene("help");
			break;
			
			case 'do-myHelp': this.controller.stageController.pushScene("help");
			break;
        }
    }
}

MainAssistant.prototype.verificaConexao = function(event){
	this.canceled = false; //auxilia o processamento e o cancelamento
	
	if(!event.isInternetConnectionAvailable){ //se nao haver conexao, exibe um alerta
		this.controller.showAlertDialog({
			onChoose: function(value) {},
			title:"Internet conection",
			message:"Internet connection unavailable",
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
	}
	else{ //mas se houver conexao, executa o 'shorten'
		var url = document.getElementById('entrada').value;
		
		if(!url){ //se o user não entrou com nada...
			return;
		}
		
		document.getElementById('loading').style.visibility = "visible"; //'Shortening url...' fica visivel no HTML
		document.getElementById('cancel').style.visibility = "visible"; //botao 'cancel' fica visivel no HTML
		document.getElementById('entrada').style.visibility = "hidden"; //'entrada' fica escondido no HTML
		document.getElementById('shorten').style.visibility = "hidden"; //botao 'go' fica escondido no HTML
		document.getElementById('clean').style.visibility = "hidden"; //botao 'clean' fica escondido no HTML
		
		while(url.substring(0,1) == ' '){ //o user pode colocar ESPAÇOS NO INICIO do url, entao eliminamos estes espaços
			url = url.substring(1);
		}
		
		if(url.substring(0,7) != 'http://'){ //se o user não colocou http://, isso é feito automaticamente
			url = 'http://' + url; 
			document.getElementById('entrada').value = url;
		}
		
		//$('#loading').html(this.radioModel.value + encodeURIComponent(url));
		
		if(!this.canceled){ //se o user nao CANCELOU... 
			$.get(this.radioModel.value + encodeURIComponent(url), function(short_url){ //é feita a requisição para encurtar o url
				if(!this.canceled){ //se o user AINDA nao cancelou
					document.getElementById('loading').style.visibility = "hidden"; //'Shortening url...' fica escondido no HTML
					document.getElementById('cancel').style.visibility = "hidden"; //botao 'cancel' fica escondido no HTML
					document.getElementById('entrada').style.visibility = "visible"; //'entrada' fica visivel no HTML
					document.getElementById('shorten').style.visibility = "visible"; //botao 'go' fica visivel no HTML
					document.getElementById('clean').style.visibility = "visible"; //botao 'clean' fica visivel no HTML
					
					document.getElementById('saida').value = short_url; // coloca na saida o url encurtado
				}
			});
		}
		
	}
	
	this.canceled = true; //o processamento chegou ao fim
}

MainAssistant.prototype.shortener = function(event){
	this.controller.serviceRequest('palm://com.palm.connectionmanager', {
	    method: 'getstatus',
	    parameters: {subscribe:true},
	    onSuccess: this.verificaConexao.bind(this), //verifica conexao
	    onFailure : function(e){}
	});
}

MainAssistant.prototype.cancel = function(event){
	this.canceled = true; //cancela
	document.getElementById('loading').style.visibility = "hidden"; //'Shortening url...' fica escondido no HTML
	document.getElementById('cancel').style.visibility = "hidden"; //botao 'cancel' fica escondido no HTML
	document.getElementById('entrada').style.visibility = "visible"; //'entrada' fica visivel no HTML
	document.getElementById('shorten').style.visibility = "visible"; //botao 'go' fica visivel no HTML
	document.getElementById('clean').style.visibility = "visible"; //botao 'clean' fica visivel no HTML
}

MainAssistant.prototype.copy = function(event){
	var saida = document.getElementById('saida').value;
	
	if(saida && (saida.substring(0,7) == 'http://') ){ //se o campo 'saída' conter no mínimo um caracter...
		this.controller.stageController.setClipboard(saida); //copia para o clipboard o URL encurtado
		
		this.controller.showAlertDialog({ //o user é notificado
			onChoose: function(value) {},
			title:"Copied short URL!",
			message:"Successfully copied short url to clipboard",
			choices:[ {label:'OK', value:'OK', type:'color'} ]
		});
	}
}

MainAssistant.prototype.clean = function(event){
	document.getElementById('entrada').value = ""; //limpa o input (entrada)
}

MainAssistant.prototype.cleanup = function(event) { //destrutor: desassocia os eventos dos elementos HTML
	Mojo.Event.stopListening(this.controller.get('copy'),Mojo.Event.tap,this.copy);
	Mojo.Event.stopListening(this.controller.get('shorten'),Mojo.Event.tap,this.shortener);
	Mojo.Event.stopListening(this.controller.get('cancel'),Mojo.Event.tap,this.cancel);
	Mojo.Event.stopListening(this.controller.get('clean'),Mojo.Event.tap,this.clean);
}	