import { useCallback, useEffect, useState } from "react";
import './App.css';

const createEmptyGrid = () => {
  return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
}


const slideLeft = (row: any) => {
  let filteredRow = row.filter((num: number) => num !== 0);
  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
    }
  }
  filteredRow = filteredRow.filter((num: number) => num !== 0);
  while (filteredRow.length < 4) filteredRow.push(0);
  return filteredRow;
};

const slideRight = (row:any) => {
  let reversed = [...row].reverse();
  let moved = slideLeft(reversed);
  return moved.reverse();
};

const transpose = (grid: any[]) => {
  return grid[0].map((_: any, colIndex: string | number) => grid.map(row => row[colIndex]));
};


const App = () => {
  const [title, setTitle] = useState('2048 game');
  
  const addRandomNumber = (grid: number[][]): any => {
  let newGrid = JSON.parse(JSON.stringify(grid))
  let emptySlots = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (newGrid[row][col] === 0) emptySlots.push({ row, col });
    }
  }
  if (emptySlots.length > 0) {
    let { row, col } = emptySlots[Math.floor(Math.random() * emptySlots.length)]
    newGrid[row][col] = Math.random() > 0 ? 2 : 4;
  } else {
    setTitle('Game Over!');
  }
  return newGrid;
}

  const [grid, setGrid] = useState(addRandomNumber(addRandomNumber(createEmptyGrid())))

  
  const handleUp = (newGrid: any) => {
    newGrid = transpose(newGrid);
    newGrid = newGrid.map((row: any) => slideLeft(row));
    return transpose(newGrid);
  }

  const handleDown = (newGrid: any) => {
    newGrid = transpose(newGrid);
    newGrid = newGrid.map((row:number) => slideRight(row));
    return transpose(newGrid);
  }

  const handleLeft = (newGrid: any) => {
    return newGrid = newGrid.map((row: any) => slideLeft(row));
  }

  const handleRight = (newGrid: any) => {
    return newGrid.map((row: any) => slideLeft([...row].reverse()).reverse());
  }

  const handleAllowedKeys = (key: string, grid: string) => {
    let newGrid = JSON.parse(JSON.stringify(grid));

    if (key === 'ArrowUp') newGrid = handleUp(newGrid);
    if (key === 'ArrowDown') newGrid = handleDown(newGrid);
    if (key === 'ArrowLeft') newGrid = handleLeft(newGrid);
    if (key === 'ArrowRight') newGrid = handleRight(newGrid);
    return newGrid;
  }

  const handleKeyDown = useCallback((event: any) => {
    const allowedKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']
    if (allowedKeys.includes(event.key)) {
      const nextGrid = handleAllowedKeys(event.key, grid);
      if (JSON.stringify(nextGrid) !== JSON.stringify(grid)) setGrid(addRandomNumber(nextGrid))
    }
  }, [grid]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown) }
  }, [handleKeyDown])

  return (<>

    <div className="game-container">
      <h1>{title}</h1>
      <div className="grid">
        {grid.map((row: any[], r: any) => row.map((cell, c) => (
          <div key={`${r}-${c}`} className={`cell cell-${cell}`}>
            {cell !== 0 ? cell : ''}
          </div>
        )))}
      </div>
    </div>


  </>);
}

export default App;