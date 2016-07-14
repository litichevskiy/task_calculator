(function( exports ) {

	const

	 	OPENQUOTES = '(',
		CLOSEQUOTES = ')',
		POINT = '.',
        PLUS = '+',
        MINUS = '-';

	function Calculator() {};

	var checkNumbers = (function() {
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

	var getTotalSum = {
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

	function convertDataIntoNumbers( list ) {

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

                if ( list[ i ] === POINT || checkNumbers( value ) ) {
                    currentValue += value;

                } else
                    if ( checkAction( value ) ) {
                        if ( currentValue !== '' ) {
                            result.push( parseFloat( currentValue ));
                            currentValue = '';
                        }

                        if ( value === '*' || value === '/' ) {
                            result.push( value );
                        } else
                            if ( value === '+' || value === '-' ) {

                                var num = parseFloat( result[ result.length -1 ] );

                                if( num >= 0 || num <= 0 ) {
                                    result.push( value );
                                } else {

                                    currentValue = value;
                                    k = i + 1;

                                    while( k < list.length ) {

                                        if ( checkNumbers( list[ k ] ) ) {
                                            currentValue += list[ k ];
                                            k++;

                                            if ( k === list.length ) {
                                                result.push( parseFloat( currentValue ) );
                                                currentValue = '';
                                                i = k - 1;
                                            }
                                        } else {

                                            result.push( parseFloat( currentValue ) );
                                            currentValue = '';
                                            i = k - 1;
                                            break;
                                        }
                                    }
                                }
                            }
                    }

            } else {

                if ( checkAction( value ) ) {

                    currentValue = value;

                    while( k < list.length ) {

                        if ( list[ k ] === POINT || checkNumbers( list[ k ] ) ) {
                            currentValue += list[ k ];
                            k++;
                            i = k -1;
                        } else {
                            result.push( parseFloat( currentValue ) );
                            currentValue = '';
                            break;
                        }
                    }

                } else {
                    currentValue = value;
                    continue;
                }
            }
		}

		if ( currentValue !== '' ) result.push( parseFloat( currentValue ) );
		return result;
	}


	Calculator.fn = Calculator.prototype;

    Calculator.fn.calculateAmount = function( string ) {

        if( typeof string !== 'string' ) throw new Error('Incorrect value: ', string );

        var data = this.dataValidation( string );
            data = this.validationString( data );

            if ( data.quotes ) data = this.getSumInQuotes( data.result );

            if ( data.length > 0 ) data = convertDataIntoNumbers( data );
            if ( data.length > 0 ) data = this.getItogSum( data );
            if ( typeof data !== 'number' ) {
                throw new Error('Incorrect value: '+ data + ', ' + 0 );
            }

            return{
                result : data
            }

    };

	Calculator.fn.dataValidation = function( string ) {

        if( string.search(/[0-9]/) === -1 ) throw new Error('incorrect value' + string )

		var result = '',
			length = string.length,
			currentValue;

		for ( var i = 0; i < length; i++ ) {
			currentValue = string[i];
			if ( checkNumbers( currentValue ) ) {
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

	Calculator.fn.validationString = function ( string ) {

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

				if ( checkNumbers( currentValue ) ) {
					if ( checkNumbers( lastElementInResult ) ) {
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
						if ( checkNumbers( lastElementInResult ) ) {
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
									} else
                                        if ( lastElementInResult === PLUS && currentValue === PLUS || currentValue === MINUS ) {
                                            result += currentValue, lastElementInResult = currentValue;
									   } else
                                            if ( lastElementInResult === MINUS && currentValue === PLUS || currentValue === MINUS ) {
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
											if ( checkNumbers( lastElementInResult ) ) {
												result += currentValue, lastElementInResult = currentValue;
												counterCloseQuotes++;
											} else {
												throw new Error('Incorrect value: '+ currentValue + ', ' + i );
											}
									} else

									if ( currentValue === POINT ) {
										if ( checkNumbers( lastElementInResult ) ) {
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
					if ( checkNumbers( currentValue ) ) {
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
					result = convertDataIntoNumbers( result );

    				if ( result.length > 1 ) {

                        result = this.getItogSum( result );
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

	Calculator.fn.getItogSum = function( list ) {

        var result, value;

        if ( list.length === 1 ) return parseFloat( list );

        for ( var i = 1; i < list.length; i += 2 ) {

            value = list[i];

            if ( value === '*' || value === '/' ) {
                result = getTotalSum[ value ]( list[ i - 1 ], list[ i + 1 ] );
                list.splice( i - 1, 3, result );
                i -= 2;
            }
        }

        for ( var i = 1; i < list.length; i += 2 ) {

            value = list[i];

            if ( value === '+' || value === '-' ) {
                result = getTotalSum[ value ]( list[ i - 1 ], list[ i + 1 ] );
                list.splice( i - 1, 3, result );
                i -= 2;
            }
        }

		return list[0];
	};


	exports.Calculator = Calculator;

})( window );