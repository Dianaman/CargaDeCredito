angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope, $timeout) {
  $scope.loginData = {};

  $scope.loginData.username = 'diana.man.91@gmail.com';
  $scope.logeado = false;
  $scope.verificado = false;

  $scope.loguear = function(){
    firebase.auth().signInWithEmailAndPassword($scope.loginData.username, $scope.loginData.password)
    .catch(function(error){
      console.info("Error", error);
    })
    .then(function(user){
      //console.log(firebase.getCurrentUser());
      console.info("Respuesta", user);
      $timeout(function(){
        if(user){
          $scope.logeado = true;
          console.log(user.emailVerified);
          $scope.verificado = user.emailVerified;
        }
        else {
          alert("no loggeado");
        }
      });
    });
  }

  $scope.desloguear = function(){
    firebase.auth().signOut();
    $scope.logeado = false;
  }
})

.controller('CargaCtrl', function($scope){
  $scope.carga = {
    token: '',
    usuario: ''
  };

  $scope.IngresarToken = function(){
    //console.log($scope.carga.token);

    if(firebase.auth().currentUser != null && firebase.auth().currentUser != undefined){
      $scope.carga.usuario = firebase.auth().currentUser.email;
      console.info($scope.carga);

      var cargaRef = firebase.database().ref('cargas/'+$scope.carga.token);
      console.info(cargaRef);
      cargaRef.transaction(function(currentData){
        console.info(currentData);
        if(currentData != null){
          return {carga: $scope.carga};
        }
        else{
          console.log('El token no existe en el sistema');
        }
      }, function(error,committed,snapshot){
        if (error) {
          console.log('Transaction failed abnormally!', error);
        } else if (!committed) {
          console.log('We aborted the transaction (because ada already exists).');
        } else {
          console.log('User ada added!');
        }
        console.log("Ada's data: ", snapshot.val());
      });
    }
    else{
      alert("No está loggeado al sistema");
    }
  }
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
