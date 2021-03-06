
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null), coordinates: ''
			}],
			stepNumber: 0,
			xIsNext: true
		}
	}

	jumpTo(step){
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		})
	}

	render() {
		const history = this.state.history;
		const stepNumber = this.state.stepNumber;
		const current = history[this.state.stepNumber];
		const chichi = calculateChichi(current.squares);

		const moves = history.map((step, move, moveCoordinate) => {
			const coordinate = moveCoordinate[move];
			const currentCoordinates = move ?
				coordinate.coordinates : '';
			const column = currentCoordinates % 3 + 1; 
			const row = currentCoordinates < 3 ? 1 : currentCoordinates < 5 ? 2 : 3;
			const btnDesc = move 
				? 'Go to move # ' +  move
				: 'Go to game start';
			const moveDesc = move
				? ' (Row ' + row + ' | Column ' + column + ')'
				: '';

			const classBold = stepNumber === move ? 'liBold' : 'liRegular';
			return (
				<li key={move} className={classBold}>
					<button onClick={() => this.jumpTo(move)}>
						{btnDesc}
					</button>
					{moveDesc}
				</li>
			);
		});

		let status;

		if (chichi) {
			status = 'Chichi: ' + chichi;
		} else {
			status = 'Next Player ' + (this.state.xIsNext ? 'X' : 'O');
		}
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}

	handleClick(i) {
		const history = this.state.history.slice(0,this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateChichi(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares
				, coordinates: i} ]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}
}

class Board extends React.Component {

	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	createBoard = () => {
		let board = [];
		let counter = 0;
		// outer Loop to create rows
		for (let i = 0; i < 3; i++) {
		  let rows = [];
  
		  // Inner Loop to crate columns
		  for (let j = 0; j < 3; j++) {
			 rows.push(
				this.renderSquare(counter)
			 );
			 counter++;
		  }
		  board.push(
			 <div className="board-row">
				{rows}
			 </div>
		  );
		}
		return board;
	 };
	 render() {
		return (
		  <div>
			 {this.createBoard()}
		  </div>
		);
	 }
}

function calculateChichi(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}
// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
