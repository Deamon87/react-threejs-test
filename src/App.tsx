import React from 'react';
import Container from '@mui/material/Container';
import './App.css';
import Canvas from "./ThreeJsCanvas";
import {Box, Slider, Stack, Typography} from "@mui/material";
import ThreeJsComponent from "./threejsClass";

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const threeJsApp : ThreeJsComponent = new ThreeJsComponent();

function App() {
  const [value, setValue] = React.useState<number>(30);

  const [lastColor, setLastColor] = React.useState<string>("");

  const handleChange = (event: Event, newValue: number | number[]) => {
      if (!Array.isArray(newValue)) {
          threeJsApp.setRotation(newValue / 30)
          setValue(newValue);
      }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const result = threeJsApp.handleClick();
      if (result !== null )
          setLastColor(result);
  }

  return (
    <Container maxWidth="xl" sx={{ p: '0px !important', m: '0px !important',  }}>
      <Container maxWidth="xl" sx={{ p: '0px !important', m: '0px !important',  }}>
        <Canvas onClick={handleClick} threeJsApp={threeJsApp} width = "700" height="512"/>
      </Container>
        <Box sx={{ width: 300 }}>

              <Slider   min={0}
                        max={360}
                        step={1}
                        aria-label="Rotation" value={value} onChange={handleChange} />
        </Box>

        <Typography variant="h5" component="h5">
            {lastColor}
        </Typography>
    </Container>
  );
}

export default App;
