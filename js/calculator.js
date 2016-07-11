(function( exports ) {

	const

	 	OPENQUOTES = '(',
		CLOSEQUOTES = ')',
		POINT = '.';

	function Calculator() {}

	function checkNumber( str ) {
		var number = parseFloat( str );
		if ( number ) return number;
		else return false;

	}

	function isNotCorrect( val, position ) {
		return{
			value : 'Incorrect value: ' + val,
			position : position
		}
	}

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

			if ( parseFloat( value ) ) {
				currentResult += value;

			} else

				if ( value === POINT ) {
					currentResult += value;

				} else

					if ( checkAction( value ) ) {

						// if( currentResult !== '' ) {
						// 	debugger
						// 	result[ currentCounter ] = currentResult;
						// 	currentCounter++;
						// }

						result[ currentCounter ] = value;
						currentCounter++;
						currentResult = '';
					}

		}

		result[ currentCounter ] = currentResult
		return result;
	}


	Calculator.fn = Calculator.prototype;


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

										if ( lastElementInResult === CLOSEQUOTES ) {
											result += currentValue, lastElementInResult = currentValue;
											counterCloseQuotes++;

										} else

											if ( checkNumber( lastElementInResult ) ) {
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

		return result
	};

	Calculator.fn.getTotalSum = function( list ) {

		var numberLeft,
			numberRight,
			action,
			result;

		for ( var l = 0, i = 1, r = 2; l < list.length; i += 2, l += 2, r += 2 ) {

			numberLeft = parseFloat( list[ l ] );
			numberRight = parseFloat( list[ r ] );
			action = list[ i ];

			if ( action === '*' || action === '/' ) {

				if ( action === '*' ) {

					result = getCurrentSum['*']( numberLeft, numberRight );
					list.splice( l, 3, result );
					i -= 2, l -= 2, r -= 2;

				} else

					if ( action === '/' ) {

						result = getCurrentSum['/']( numberLeft, numberRight );
						list.splice( l, 3, result );
						i -= 2, l -= 2, r -= 2;
				}
			}
		}

		for ( var l = 0, i = 1, r = 2; l < list.length; i += 2, l += 2, r += 2 ) {

			numberLeft = parseFloat( list[ l ] );
			numberRight = parseFloat( list[ r ] );
			action = list[ i ];

			if ( action === '+' || action === '-' ) {

				if ( action === '+' ) {

					result = getCurrentSum['+']( numberLeft, numberRight );
					list.splice( l, 3, result );
					i -= 2, l -= 2, r -= 2;

				} else

					if ( action === '-' ) {

						result = getCurrentSum['-']( numberLeft, numberRight );
						list.splice( l, 3, result );
						i -= 2, l -= 2, r -= 2;
					}
			}
		}

		return list[ 0 ];
	};


	exports.Calculator = Calculator;

})( window );