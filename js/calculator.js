(function( exports ) {

	const

	 	OPENQUOTES = '(',
		CLOSEQUOTES = ')',
		POINT = '.';

	function Calculator() {};

	var storageNumbers = (function() {
		var storage = {
			0 : '0', 1 : '1', 2 : '2',
			3 : '3', 4 : '4', 5 : '5',
			6 : '6', 7 : '7', 8 : '8',
			9 : '9'
		};
		return function ( str ) {
			if ( storage[ str ] ) return str;
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

                if( currentResult !== '' ) {

                    result[ currentCounter ] = currentResult;
                    currentCounter++;
                    result[ currentCounter ] = value;
                    currentCounter++;
                    currentResult = '';

                } else {

                    result[ currentCounter ] = value;
                    currentCounter++;
                }

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

        if( typeof string !== 'string' ) throw new Error('Incorrect value: ', string );

        var data = this.dataValidation( string );

            data = this.validationExpression( data );

            if ( data.quotes ) data = this.getSumInQuotes( data.result );
            else data = sortArray( data );
            debugger
            data = this.getItogSum( data );

            data = parseFloat( data[0] );
            if ( typeof data !== 'number' ) {
                throw new Error('Incorrect value: '+ data + ', ' + 0 );
            }

            return{
                result : data
            }

    };

	Calculator.fn.dataValidation = function( string ) {

		var result = '',
			length = string.length,
			currentValue;

		for ( var i = 0; i < length; i++ ) {
			currentValue = string[i];
			if ( storageNumbers( currentValue ) ) {
				result += currentValue;
			} else
				if( checkSimbol( currentValue ) ) {
						result += currentValue;
				} else
					if ( checkAction( currentValue ) ) {
						result += currentValue;
					} else {
						throw new Error('Incorrect value: '+ currentValue + ', ' + i );
					}
		}

		return result;
	}

	Calculator.fn.validationExpression = function ( string ) {

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

				if ( storageNumbers( currentValue ) ) {
					if ( storageNumbers( lastElementInResult ) ) {
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
									throw new Error('Incorrect value: '+ currentValue + ', ' + i );
								}

				} else

					if ( checkAction( currentValue ) ) {
						if ( storageNumbers( lastElementInResult ) ) {
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
										throw new Error('Incorrect value: '+ currentValue + ', ' + i );
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
										throw new Error('Incorrect value: '+ currentValue + ', ' + i );
									}

								} else

									if ( currentValue === CLOSEQUOTES ) {
										if ( lastElementInResult === CLOSEQUOTES ) {
											result += currentValue, lastElementInResult = currentValue;
											counterCloseQuotes++;
										} else
											if ( storageNumbers( lastElementInResult ) ) {
												result += currentValue, lastElementInResult = currentValue;
												counterCloseQuotes++;
											} else {
												throw new Error('Incorrect value: '+ currentValue + ', ' + i );
											}
									} else

									if ( currentValue === POINT ) {
										if ( storageNumbers( lastElementInResult ) ) {
											result += currentValue, lastElementInResult = currentValue;
										} else {
                                            throw new Error('Incorrect value: '+ currentValue + ', ' + i );
										}

									} else {
										throw new Error('Incorrect value: '+ currentValue + ', ' + i );
									}

			} else {

				if ( currentValue === valuePlus || currentValue === valueMinus ) {
					result += currentValue;
					lastElementInResult = currentValue;
				} else
					if ( storageNumbers( currentValue ) ) {
							result += currentValue;
							lastElementInResult = currentValue;
					} else

						if ( currentValue === OPENQUOTES ) {
							result += currentValue;
							lastElementInResult = currentValue;
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
					result = sortArray( result );

					if ( result.length % 2 === 0 ) {
	 					result = result[0] + result[1];
						string.splice( cashPosition, i + 1 - cashPosition, result + '' )
						cashPosition = 0;
						i = -1;

					} else {

							result = this.getItogSum( result );
							string.splice( cashPosition, i + 1 - cashPosition, result + '' )
							cashPosition = 0;
							i = -1;
						}
				}
		}

		return string;
	};
///////////////////////////////////////////////////////////////////////
	Calculator.fn.getItogSum = function( list ) {

        var action_1 = ['*','/'],
            action_2 = ['+','-'],
            numberLeft,
            numberRight,
            result;

        if ( list.length === 1 ) return list;////// ?????

        function getSum( act, numberLeft, action, numberRight ) {

            var result;

            if ( action === act[0] || action === act[1] ) {

                if ( action === act[0] ) {

                    result = getCurrentSum[act[0]](
                                parseFloat( numberLeft ), parseFloat( numberRight )
                            );

                } else

                    if ( action === act[1] ) {

                        result = getCurrentSum[act[1]](
                                    parseFloat( numberLeft ), parseFloat( numberRight )
                                );
                }
            }

            return result;
        }

        for ( var i = 0; i < list.length; i += 2 ) {

            numberLeft = list[ i ];

            if ( parseFloat( numberLeft ) / 2 ) {

                numberRight = list[ i + 2 ];
                action = list[ i + 1 ];

                if ( action === '*' || action === '/' ) {

                    result = getSum( action_1, numberLeft, action, numberRight );
                    list.splice( i, 3, result + '' );
                }

            } else if ( checkAction( numberLeft[ 0 ] ) ) {

                var newValue = numberLeft[ i ] + list[ i + 1 ];
                list.splice( i, 2, newValue );
                i -= 2;
                continue;

            } else throw new Error( 'unknown value :' + numberLeft );
        }

        for ( var i = 0; i < list.length; i += 2 ) {

            numberLeft = list[ i ];

            if ( parseFloat( numberLeft ) / 2 ) {

                numberRight = list[ i + 2 ];
                action = list[ i + 1 ];

                if ( action === '+' || action === '-' ) {

                    result = getSum( action_2, numberLeft, action, numberRight );
                    list.splice( i, 3, result + '' );
                }

            } else if ( checkAction( numberLeft[ 0 ] ) ) {

                var newValue = numberLeft[ i ] + list[ i + 1 ];
                list.splice( i, 2, newValue );
                i -= 2;
                continue;

            } else throw new Error( 'unknown value :' + numberLeft );
        }

		return list;
	};


	exports.Calculator = Calculator;

})( window );