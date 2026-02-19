"use client";
import { Box, Button, ButtonGroup, Fab, Paper, Typography } from "@mui/material";
import Image from "next/image";
import ImageListItem from "../components/image_list_item";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { useDialog } from "../contexts/dialog-context";
import UploadDialog from "../dialogs/upload_image.dialog";
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation("common");
  const [firstLoad, setFirstLoad] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const sortTypes = [
    { label: t("name"), value: "name" },
    { label: t("date"), value: "date" },
  ];

  const [images, setImages] = useState<any[]>([]); //TODO: define type

  const uploadImage = async (file: File) => {
    
  };

  useEffect(() => {
    //TODO: fetch images or if already fetched, sort them
    if (firstLoad) {
      //TODO: fetch + sort images
      setFirstLoad(false);
    } else {
      //TODO: sort images
    }
  }, [sortBy]);

  //TODO: check if good
  const sortImages = (images: any[]) => {
    if (sortBy === "name") {
      return images.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return images.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
        {/* Switch */}
        <ButtonGroup variant="outlined" sx={{ alignSelf: 'end' }}>
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

        <Fab onClick={() => {
          setDialogOpen(true)
        }} size="large" color="primary" sx={{ position: "absolute", bottom: 15, right: 15 }}>
          <Add />
        </Fab>

        <UploadDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={(file: File) => uploadImage(file)}
        />
      </Box>
    </>
  );
}
