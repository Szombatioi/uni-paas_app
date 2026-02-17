"use client";
import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import Image from "next/image";
import ImageListItem from "./components/image_list_item";
import { useEffect, useState } from "react";

export default function Home() {
  const [firstLoad, setFirstLoad] = useState(true);

  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const sortTypes = [
    { label: "Név", value: "name" },
    { label: "Dátum", value: "date" },
  ];

  const [images, setImages] = useState<any[]>([]); //TODO: define type

  useEffect(() => {
    //TODO: fetch images or if already fetched, sort them
    if(firstLoad) {
      //TODO: fetch + sort images
      setFirstLoad(false);
    } else {
      //TODO: sort images
    }
  }, [sortBy]);

  //TODO: check if good
  const sortImages = (images: any[]) => {
    if(sortBy === "name") {
      return images.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return images.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, padding: 2}}>
        {/* Switch */}
        <ButtonGroup variant="outlined" sx={{alignSelf: 'end'}}>
          {sortTypes.map((type) => (
            <Button
              key={type.value}
              variant={sortBy === type.value ? "contained" : "outlined"}
              onClick={() => setSortBy(type.value as any)}
            >
              {type.label}
            </Button>
          ))}
        </ButtonGroup>

        {/* List */}
        <Paper>

        </Paper>
      </Box>
    </>
  );
}
