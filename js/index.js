(function(){

	var moduleCalculator = new Calculator(),
        calculator = $('.container_calc'),
        input = $('.field_for_text'),
        result;

    $(calculator).click(function(event) {

        if ( !moduleCalculator ) {
            throw new Error('calculator required module calculator !');
        }

        var targetValue = event.target.dataset.val;

        if( !targetValue ) return;

            if( targetValue === 'clear' ) {
                $(input).val('');
                $(input).focus();
            } else
                if ( targetValue === '=' ) {
                    getSum();
                } else  $(input).val( $(input).val() + targetValue );
    });

    $(document).keydown(function(event) {
        if( event.keyCode === 13 ) {
            if( $(input).val().length > 0 ){
                getSum()
            }
        }
    });

    function getSum ( ) {

        try{

            result = moduleCalculator.calculateSum( $(input).val() );
            $(input).val( result['result'] );
            $(input).focus();

        } catch( error ) {

            console.info( error.message )
        }
    };

})();