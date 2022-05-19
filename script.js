
 const prefilter = () => {
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        options.data = JSON.stringify(originalOptions.data)
        console.log({options,originalOptions,jqXHR});
    })

}
  Kameleoon.API.Core.runWhenConditionTrue(
    () => window.$,
    function() {
        $(document).ready(function() {
            // variables
            // variables

            var variationId = "#xxx";
            var version = 0.00000000001;
            console.log(`%cid du test ${variationId} et version ${version}`, "color: green; font-family:monospace; font-size: 20px");
            prefilter()
      
         });
    },
    100
);