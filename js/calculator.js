(function( exports ){

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


	Calculator.fn = Calculator.prototype;


	Calculator.fn.dataValidation = function( string ) {

		var result = '',
			length = string.length,
			currentValue;

		for ( var i = 0; i < length; i++ ) {

			currentValue = string[i];

			if ( numbers( currentValue ) ) {

				result += currentValue;

			} else if( checkSimbol( currentValue ) ) {

						result += currentValue;

					} else if ( checkAction( currentValue ) ) {

						result += currentValue;

							} else {

								return isNotCorrect( currentValue, i );
							}
		}

		return result; // next method
	}

	Calculator.fn.checkData = function ( string ) {

		var length = string.length,
			openQuotes = '(',
			closeQuotes = ')',
			point = '.',
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
						continue;
					}
					if ( ( checkAction( lastElementInResult ) ) ) {
						result += currentValue, lastElementInResult = currentValue;
						continue;
					}
					if ( lastElementInResult === openQuotes ) {
						result += currentValue, lastElementInResult = currentValue;
						continue;
					}
					if ( lastElementInResult === point ) {
						result += currentValue, lastElementInResult = currentValue;
						continue;

					} else {
						return isNotCorrect( currentValue, i );
					}

				} else if ( checkAction( currentValue ) ) {

							if ( numbers( lastElementInResult ) ) {
								result += currentValue, lastElementInResult = currentValue;
								continue;
							}
							if ( lastElementInResult === closeQuotes ) {
								result += currentValue, lastElementInResult = currentValue;
								continue;
							}
							if ( lastElementInResult === openQuotes && currentValue === valuePlus ) {
								result += currentValue, lastElementInResult = currentValue;
								continue;
							}
							if ( lastElementInResult === openQuotes && currentValue === valueMinus ) {
								result += currentValue, lastElementInResult = currentValue;
								continue;

							} else {
								return isNotCorrect( currentValue, i );
							}

						} else if ( currentValue === openQuotes ) {

									if ( lastElementInResult === openQuotes ) {
										result += currentValue, lastElementInResult = currentValue;
										counterOpenQuotes++;
										continue;
									}
									if ( checkAction( lastElementInResult ) ) {
										result += currentValue, lastElementInResult = currentValue;
										counterOpenQuotes++;
										continue;

									} else {
										return isNotCorrect( currentValue, i );
									}
								} else if ( currentValue === closeQuotes ) {

											if ( lastElementInResult === closeQuotes ) {
												result += currentValue, lastElementInResult = currentValue;
												counterCloseQuotes++;
												continue;
											}
											if ( checkNumber( lastElementInResult ) ) {
												result += currentValue, lastElementInResult = currentValue;
												counterCloseQuotes++;
												continue;

											} else {
												return isNotCorrect( currentValue, i );
											}
										} else if ( currentValue === point ) {

													if ( numbers( lastElementInResult ) ) {
														result += currentValue, lastElementInResult = currentValue;
														continue;

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

				} else if ( numbers( currentValue ) ) {

							result += currentValue;
							lastElementInResult = currentValue;

						} else if ( currentValue === openQuotes ) {

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
	}

	Calculator.fn.getTotalSum = function( list ) {

		var numberLeft,
			numberRight,
			action,
			result;

		for ( var l = 0, i = 1, r = 2; l < list.length; i += 2, l += 2, r += 2 ) {

			numberLeft = parseInt( list[ l ] );
			numberRight = parseInt( list[ r ] );
			action = list[ i ];

			if ( action === '*' || action === '/' ) {

				if ( action === '*' ) {

					result = getCurrentSum['*']( numberLeft, numberRight );
					list.splice( l, 3, result );
					i -= 2, l -= 2, r -= 2;

				} else if ( action === '/' ) {

					result = getCurrentSum['/']( numberLeft, numberRight );
					list.splice( l, 3, result );
					i -= 2, l -= 2, r -= 2;
				}
			}
		}

		for ( var l = 0, i = 1, r = 2; l < list.length; i += 2, l += 2, r += 2 ) {

			numberLeft = parseInt( list[ l ] );
			numberRight = parseInt( list[ r ] );
			action = list[ i ];

			if ( action === '+' || action === '-' ) {

				if ( action === '+' ) {

					result = getCurrentSum['+']( numberLeft, numberRight );
					list.splice( l, 3, result );
					i -= 2, l -= 2, r -= 2;

				} else if ( action === '-' ) {

					result = getCurrentSum['-']( numberLeft, numberRight );
					list.splice( l, 3, result );
					i -= 2, l -= 2, r -= 2;
				}
			}
		}

		return list[ 0 ];//////
	};


	exports.Calculator = Calculator;

})( window );