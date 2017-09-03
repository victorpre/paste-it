(function() {
  angular.module('typeonme').component('noteTextField', {

    bindings: {
      grid: '@',
      value: '@',
      model: '='
    },
    template: `
  <div class="row">
    <div class="col s12">
        <form>
              <div class="input-field col s11">
                      <textarea text-box="{{$ctrl.value}}" id="textarea1" class="materialize-textarea lined" ng-focus="true" ng-model="$ctrl.model" ></textarea>
          <label for="textarea1">Start typping</label>
        </div>
      </form>
    </div>
  </div>
  `
  });

})()
