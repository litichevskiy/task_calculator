(function( exports ) {

	const

	 	OPENQUOTES = '(',
		CLOSEQUOTES = ')',
		POINT = '.',
        PLUS = '+',
        MINUS = '-';

	function Calculator() {};

	var getSum = {
		'+' : function( a, b ) { return a + b },
		'-' : function( a, b ) { return a - b },
		'*' : function( a, b ) { return a * b },
		'/' : function( a, b ) { return a / b }
	};

	function deleteSpace( str ) {
		return str.replace( /\s/g, '' );
	}

	var isAction = (function(){
		var storageAction = ['*','/','+','-'];
		return function ( val ) {
			var index = storageAction.indexOf( val );

			if ( index < 0 ) return false;
			else return val;
		}

	})();

    Calculator.fn = Calculator.prototype;

    Calculator.fn.calculateSum = function( string ) {

        if( typeof string !== 'string' ) throw new Error('Incorrect value: ', string );

        var data = this.searchForInvalidCharacters( string );
            data = this.validationString( data );

            if ( data.quotes ) data = this.getSumInQuotes( data.result );

            if ( data.length >= 1 ) data = this.convertDataIntoNumbers( data );
            if ( data.length >= 1 ) data = this.SearchOrderOfArithmeticOperations( data );
            if ( typeof data !== 'number' ) {
                throw new Error('Incorrect value: '+ data + ', ' + 0 );
            }

            return{
                result : data
            }

    };

    Calculator.fn.convertDataIntoNumbers = function( list ) {

        if ( list.length === 1 ) return parseFloat( list );

        var length = list.length,
            currentResult = '',
            currentCounter = 0,
            result = [],
            value,
            currentValue;

        for ( var i = 0, k = 1; i < length; i++ ) {

            value = list[i];

            if ( i > 0 ) {

                if ( list[ i ] === POINT || !isNaN( value ) ) {
                    currentValue += value;

                } else
                    if ( isAction( value ) ) {
                        if ( currentValue !== '' ) {
                            result.push( parseFloat( currentValue ));
                            currentValue = '';
                        }

                        if ( value === '*' || value === '/' ) {
                            result.push( value );
                        } else
                            if ( value === '+' || value === '-' ) {

                                if( !isNaN( result[ result.length -1 ] ) ) {
                                    result.push( value );

                                } else  currentValue = value;
                            }
                    }

            } else currentValue = value;
        }

        if ( currentValue !== '' ) result.push( parseFloat( currentValue ) );
        return result;
    }


	Calculator.fn.searchForInvalidCharacters = function( string ) {

        if( string.search(/[0-9]/) === -1 ) throw new Error('incorrect value' + string )

		var result = '',
			length = string.length,
			currentValue;

		for ( var i = 0; i < length; i++ ) {
			currentValue = string[i];
			if ( !isNaN( currentValue ) ) {
				result += currentValue;
			} else
				if( currentValue === OPENQUOTES  ||
                    currentValue === CLOSEQUOTES ||
                    currentValue === POINT  )
                {
						result += currentValue;
				} else
					if ( isAction( currentValue ) ) {
						result += currentValue;
					} else {
						throw new Error('Incorrect value: '+ currentValue + ', ' + i );
					}
		}

		return result;
	}

	Calculator.fn.validationString = function ( string ) {

        var length = string.length,
            counterOpenQuotes = 0,
            counterCloseQuotes = 0,
            result = '',
            currentValue,
            lastElementInResult;

        for ( var i = 0; i < length; i++ ) {

            currentValue = string[i];

            if ( result.length >= 1 ) {

                if ( !isNaN( currentValue ) ) {

                   if( !isNaN( lastElementInResult )       ||
                        isAction( lastElementInResult ) ||
                        lastElementInResult === OPENQUOTES ||
                        lastElementInResult === POINT
                    ) {
                          result += currentValue, lastElementInResult = currentValue;
                      }
                      else throw new Error('Incorrect value: '+ currentValue + ', ' + i );

                } else

                    if ( isAction( currentValue ) ) {

                        if ( !isNaN( lastElementInResult ) ||
                             lastElementInResult === CLOSEQUOTES ||
                             lastElementInResult === OPENQUOTES && currentValue === PLUS  ||
                             lastElementInResult === OPENQUOTES && currentValue === MINUS ||
                             lastElementInResult === PLUS && currentValue === PLUS  ||
                             currentValue === MINUS ||
                             lastElementInResult === MINUS && currentValue === PLUS ||
                             currentValue === MINUS
                        ) {
                            result += currentValue, lastElementInResult = currentValue;
                          }
                        else throw new Error('Incorrect value: '+ currentValue + ', ' + i );

                    } else

                        if ( currentValue === OPENQUOTES ) {

                            if ( lastElementInResult === OPENQUOTES ||
                                 isAction( lastElementInResult )
                            ) {
                               result += currentValue, lastElementInResult = currentValue;
                                counterOpenQuotes++;
                            }
                            else throw new Error('Incorrect value: '+ currentValue + ', ' + i );

                        } else

                            if ( currentValue === CLOSEQUOTES ) {

                                if ( lastElementInResult === CLOSEQUOTES ) {
                                    result += currentValue, lastElementInResult = currentValue;
                                    counterCloseQuotes++;
                                } else
                                    if ( !isNaN( lastElementInResult ) ) {
                                        result += currentValue, lastElementInResult = currentValue;
                                        counterCloseQuotes++;
                                    } else {
                                        throw new Error('Incorrect value: '+ currentValue + ', ' + i );
                                    }
                            } else

                                if ( currentValue === POINT ) {
                                    if ( !isNaN( lastElementInResult ) ) {
                                        result += currentValue, lastElementInResult = currentValue;
                                    } else {
                                        throw new Error('Incorrect value: '+ currentValue + ', ' + i );
                                    }

                                } else {
                                    throw new Error('Incorrect value: '+ currentValue + ', ' + i );
                                }

            } else {
                if ( currentValue === PLUS || currentValue === MINUS ) {
                    result += currentValue, lastElementInResult = currentValue;
                } else
                    if ( !isNaN( currentValue ) ) {
                            result += currentValue, lastElementInResult = currentValue;
                    } else
                        if ( currentValue === OPENQUOTES ) {
                            result += currentValue, lastElementInResult = currentValue;
                            counterOpenQuotes++;

                        } else {
                            throw new Error('Incorrect value: '+ currentValue + ', ' + i );
                        }
            }
        }

        if ( counterOpenQuotes === counterCloseQuotes ) {
            if ( counterOpenQuotes > 0 ) {
                return{
                    result : result,
                    quotes : true
                }
            } else return result;
        }
        else throw new Error( 'incorrect number of quotes' + ', ' + 0 );
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
					result = this.convertDataIntoNumbers( result );

    				if ( result.length > 1 ) {

                        result = this.SearchOrderOfArithmeticOperations( result );
                        string.splice( cashPosition, i + 1 - cashPosition, result + '' );
                        cashPosition = 0;
                        i = -1;
                    }
                    else{

                        string.splice( cashPosition, i + 1 - cashPosition, result + '' );
                    }
				}
		}

		return string;
	};

	Calculator.fn.SearchOrderOfArithmeticOperations = function( list ) {

        var result, value;

        if ( list.length === 1 || list.length === 2 ) return parseFloat( list );

        for ( var i = 1; i < list.length; i += 2 ) {

            value = list[i];

            if ( value === '*' || value === '/' ) {
                result = getSum[ value ]( list[ i - 1 ], list[ i + 1 ] );
                list.splice( i - 1, 3, result );
                i -= 2;
            }
        }

        for ( var i = 1; i < list.length; i += 2 ) {

            value = list[i];

            if ( value === '+' || value === '-' ) {
                result = getSum[ value ]( list[ i - 1 ], list[ i + 1 ] );
                list.splice( i - 1, 3, result );
                i -= 2;
            }
        }

		return list[0];
	};


	exports.Calculator = Calculator;

})( window );