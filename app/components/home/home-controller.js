angular.module('TripSorter')
  .controller('TripSorterCtrl', ['$scope', 'RequestService', function ($scope, RequestService) {


    var init = init;
    var initCities = initCities;
    var ctrl = this;

    $scope.routesType = {
      'all' : 'all',
      'cheapest' : 'cheapest',
      'fastest' : 'fastest' 
    };

    $scope.showDeals = false;

    $scope.selectedRoute = $scope.routesType.cheapest;  

    initCities();
    init();

    $scope.routeChanged = function() {
      $scope.currentDeals = getCurrentDeals();
    };

    $scope.changeDepartureCity = function(city) {
      $scope.depCity = city;
    };

    $scope.changeArrivalCity = function(city) {
      $scope.arrCity = city;
    };

    $scope.reset = function() {
      initCities();
      $scope.showDeals = false;
    };

    $scope.search = function() {      
      $scope.currentDeals = getCurrentDeals();
      $scope.showDeals = true;
    };

    $scope.getFare = function(deal) {
      return deal.cost - deal.discount;
    }

    function init() {
      RequestService.get('response.json')
        .then(function(response){

          ctrl.deals = response.data.deals;
          $scope.arrivals = _.uniq(_.pluck(ctrl.deals, 'arrival'));
          $scope.departures = _.uniq(_.pluck(ctrl.deals, 'departure'));

        }).catch(function(error){
          alert(error); // toaster can be used
        });
    };

    function initCities(){
      $scope.depCity = 'Departure City';
      $scope.arrCity = 'Arrival City';
    };

    function getCurrentDeals() {
      
      var deals = [];

      if($scope.depCity === 'Departure City') {
        alert('Please select departure city'); //TODO toaster can be used to make look better
        return;
      }

      if($scope.arrCity === 'Arrival City') {
        alert('Please select arrival city'); //TODO toaster can be used to make look better
        return;
      }

      var currentDeals = ctrl.deals.filter(function(deal){
        return deal.departure === $scope.depCity && deal.arrival === $scope.arrCity ; 
      });

      if(!currentDeals.length) {
        return;
      }

      if($scope.selectedRoute === $scope.routesType.cheapest) {
        var cheapestDeal = currentDeals[0];
        var initialFare = cheapestDeal.cost - cheapestDeal.discount;
        currentDeals.forEach(function(currentDeal){
          var fare = currentDeal.cost - currentDeal.discount;
          if(fare <  initialFare) {
            cheapestDeal = currentDeal;
            initialFare = fare;
          }
        });
        deals.push(cheapestDeal);
      }


      if($scope.selectedRoute === $scope.routesType.fastest) {
        var fastestDeal = currentDeals[0]; 
        var initialDurationInMin = ( fastestDeal.duration.h * 60 ) + (fastestDeal.duration.m);
        currentDeals.forEach(function(currentDeal){
          var durationInMin = ( currentDeal.duration.h * 60 ) + (currentDeal.duration.m);
          if(durationInMin <  initialDurationInMin) {
            fastestDeal = currentDeal;
            initialDurationInMin = durationInMin;
          }
        });
        deals.push(fastestDeal);
      }

      if($scope.selectedRoute === $scope.routesType.all) {
        deals = currentDeals;
      }

      return deals;
    }


  }]);
