(function( exports ) {

	const

	 	OPENQUOTES = '(',
		CLOSEQUOTES = ')',
		POINT = '.';

	function Calculator() {};

	function isNotCorrect( val, position ) {
		return{
			value    : 'Incorrect value: ' + val,
			position : position,
            result   : false
		}
	};

	var numbers = (function(){
		var storageNumbers = {
			0 : '0', 1 : '1', 2 : '2',
			3 : '3', 4 : '4', 5 : '5',
			6 : '6', 7 : '7', 8 : '8',
			9 : '9'
		};
		return function ( str ) {
			if ( storageNumbers[str] ) return str;
			else return false;
		}

	})();

	var getCurrentSum = {
		'+' : function( a, b ) { return a + b },
		'-' : function( a, b ) { return a - b },
		'*' : function( a, b ) { return a * b },
		'/' : function( a, b ) { return a / b }
	};

	function deleteSpace( str ) {
		return str.replace( /\s/g, '' );
	}

	var checkSimbol = (function() {
		var storageSimbol = ['(',')','.'];
		return function( val ) {
			var index = storageSimbol.indexOf( val );

			if ( index < 0 ) return false;
			else return val;
		}

	})();

	var checkAction = (function(){
		var storageAction = ['*','/','+','-'];
		return function ( val ) {
			var index = storageAction.indexOf( val );

			if ( index < 0 ) return false;
			else return val;
		}

	})();

	function sortArray( list ) {

		var length = list.length,
			currentResult = '',
			currentCounter = 0,
			result = [],
			value,
			currentValue;

		for ( var i = 0; i < length; i++ ) {

			value = list[i];

			if ( checkAction( value ) ) {

                result[ currentCounter ] = currentResult;
                currentCounter++;
                result[ currentCounter ] = value;
                currentCounter++;
                currentResult = '';

            } else

                if ( value === POINT ) {
                    currentResult += value;

                } else

                    if ( typeof parseFloat( value ) === 'number' ) {

				        currentResult += value;
					}

		}

		result[ currentCounter ] = currentResult
		return result;
	}


	Calculator.fn = Calculator.prototype;

    Calculator.fn.calculateAmount = function( string ) {

            if( typeof string !== 'string' ) throw('Incorrect value: ', string );

        var data = this.dataValidation( string );

            if ( data.result === false ) return data;
            else data = this.checkData( data );

            if ( data.result === false ) return data;
            else data = this.getSumInQuotes( data );

            data = this.getTotalSum( data );

            if ( typeof data[0] !== 'number' ) return isNotCorrect( data, 0 );

            return{
                result : data[0]
            }

    };

	Calculator.fn.dataValidation = function( string ) {

		var result = '',
			length = string.length,
			currentValue;

		for ( var i = 0; i < length; i++ ) {

			currentValue = string[i];

			if ( numbers( currentValue ) ) {

				result += currentValue;

			} else

				if( checkSimbol( currentValue ) ) {

						result += currentValue;

				} else

					if ( checkAction( currentValue ) ) {

						result += currentValue;

					} else {

						return isNotCorrect( currentValue, i );
					}
		}

		return result;
	}

	Calculator.fn.checkData = function ( string ) {

		var length = string.length,
			valuePlus = '+',
			valueMinus = '-',
			counterOpenQuotes = 0,
			counterCloseQuotes = 0,
			result = '',
			currentValue,
			lastElementInResult;

		for ( var i = 0; i < length; i++ ) {

			currentValue = string[i];

			if ( result.length >= 1 ) {

				if ( numbers( currentValue ) ) {

					if ( numbers( lastElementInResult ) ) {
						result += currentValue, lastElementInResult = currentValue;

					} else

						if ( ( checkAction( lastElementInResult ) ) ) {
							result += currentValue, lastElementInResult = currentValue;

						} else

							if ( lastElementInResult === OPENQUOTES ) {
								result += currentValue, lastElementInResult = currentValue;

							} else

								if ( lastElementInResult === POINT ) {
									result += currentValue, lastElementInResult = currentValue;

								} else {

									return isNotCorrect( currentValue, i );
								}

				} else

					if ( checkAction( currentValue ) ) {

						if ( numbers( lastElementInResult ) ) {
							result += currentValue, lastElementInResult = currentValue;

						} else

							if ( lastElementInResult === CLOSEQUOTES ) {
								result += currentValue, lastElementInResult = currentValue;

							} else

								if ( lastElementInResult === OPENQUOTES && currentValue === valuePlus ) {
									result += currentValue, lastElementInResult = currentValue;

								} else

									if ( lastElementInResult === OPENQUOTES && currentValue === valueMinus ) {
										result += currentValue, lastElementInResult = currentValue;

									} else {

										return isNotCorrect( currentValue, i );
									}

					} else

						if ( currentValue === OPENQUOTES ) {

							if ( lastElementInResult === OPENQUOTES ) {
								result += currentValue, lastElementInResult = currentValue;
								counterOpenQuotes++;

							} else

								if ( checkAction( lastElementInResult ) ) {
									result += currentValue, lastElementInResult = currentValue;
									counterOpenQuotes++;

								} else {

										return isNotCorrect( currentValue, i );
									}

								} else

									if ( currentValue === CLOSEQUOTES ) {

										// if ( lastElementInResult === CLOSEQUOTES ) {
										// 	result += currentValue, lastElementInResult = currentValue;
										// 	counterCloseQuotes++;

										// } else

											if ( numbers( lastElementInResult ) ) {
												result += currentValue, lastElementInResult = currentValue;
												counterCloseQuotes++;

											} else {

												return isNotCorrect( currentValue, i );
											}
									} else

									if ( currentValue === POINT ) {

										if ( numbers( lastElementInResult ) ) {
											result += currentValue, lastElementInResult = currentValue;

										} else {

											return isNotCorrect( currentValue, i );
										}

									} else {

										return isNotCorrect( currentValue, i );
									}

			} else {

				if ( currentValue === valuePlus || currentValue === valueMinus ) {

					result += currentValue;
					lastElementInResult = currentValue;

				} else

					if ( numbers( currentValue ) ) {

							result += currentValue;
							lastElementInResult = currentValue;

					} else

						if ( currentValue === OPENQUOTES ) {

							result += currentValue;
							lastElementInResult = currentValue;
							counterOpenQuotes++;

						} else {

							return isNotCorrect( currentValue, i );
						}
			}
		}

		if ( counterOpenQuotes === counterCloseQuotes ) return result;
		else return isNotCorrect( 'incorrect number of quotes', 0 );
	};

	Calculator.fn.getSumInQuotes = function( string ) {

		string = string.split('');

		var currentValue,
			cashPosition,
			result;

		for ( var i = 0; i < string.length; i++ ) {

			currentValue = string[i];

			if ( currentValue === OPENQUOTES ) {
				cashPosition = i;

			} else

				if ( currentValue === CLOSEQUOTES ) {
					result = string.slice( cashPosition + 1, i );
					result = sortArray( result );

					if ( result.length % 2 === 0 ) {
						result = parseFloat( result[0] + result[1] );
						string.splice( cashPosition, i + 1 - cashPosition, result + '' )
						cashPosition = 0;
						i = -1;

					} else {

							result = this.getTotalSum( result );
							string.splice( cashPosition, i + 1 - cashPosition, result + '' )
							cashPosition = 0;
							i = -1;
						}
				}
		}

		return string;
	};

	Calculator.fn.getTotalSum = function( list ) {

        var action_1 = ['*','/'],
            action_2 = ['+','-'];

        function getSum( list, act ) {

            var numberLeft,
                numberRight,
                action,
                result;

            for ( var i = 0; i < list.length; i += 2 ) {

                numberLeft = parseFloat( list[ i ] );
                numberRight = parseFloat( list[ i + 2 ] );
                action = list[ i + 1 ];

                if ( action === act[0] || action === act[1] ) {

                    if ( action === act[0] ) {

                        result = getCurrentSum[ act[0] ]( numberLeft, numberRight );
                        list.splice( i, 3, result );

                        if ( i + 1 === list.length ) continue;
                        else i -= 2;

                    } else

                        if ( action === act[1] ) {

                            result = getCurrentSum[ act[1] ]( numberLeft, numberRight );
                            list.splice( i, 3, result );

                            if ( i + 1 === list.length ) continue;
                            else i -= 2;
                    }
                }
            }

            return list;
        }

        list = getSum( list, action_1 );
        list = getSum( list, action_2 );

		return list;///////////////////////////////////////////////
	};


	exports.Calculator = Calculator;

})( window );