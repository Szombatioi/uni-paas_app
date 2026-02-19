"use client";
import { Box, Button, ButtonGroup, Fab, Paper, Typography } from "@mui/material";
import Image from "next/image";
import ImageListItem from "../components/image_list_item";
import { useEffect, useRef, useState } from "react";
import { Add, ImageNotSupportedTwoTone } from "@mui/icons-material";
import { useDialog } from "../contexts/dialog-context";
import UploadDialog from "../components/dialogs/upload_image.dialog";
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set";
import { useTranslation } from "react-i18next";
import api from "@/axios/auth-axios";
import { Severity, useSnackbar } from "../contexts/snackbar-provider";
import { ImageDto } from "../components/dto/image.dto";

export default function Home() {
  const { t } = useTranslation("common");
  const { showMessage } = useSnackbar();
  const [firstLoad, setFirstLoad] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const sortTypes = [
    { label: t("name"), value: "name" },
    { label: t("date"), value: "date" },
  ];

  const [images, setImages] = useState<ImageDto[]>([]); //TODO: define type
  const imagesRef = useRef<ImageDto[]>([]);

  const uploadImage = async (file: File, imageName: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", imageName);

    try {
      await api.post("/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showMessage(t("image.upload_success", Severity.success));
    } catch (err) {

    }
  };

  useEffect(() => {
    async function fetchImages() {
      if (firstLoad) {
        try {
          const res = await api.get<ImageDto[]>("/images");
          setImages(res.data);
          imagesRef.current = res.data;
          sortImages();
        } catch (err) {
          showMessage(t("image.couldnt_fetch"));
          return;
        }
        setFirstLoad(false);
      } else {
        sortImages();
      }


    }
    fetchImages();
  }, [sortBy]);

  //TODO: check if good
  const sortImages = () => {
    if (sortBy === "name") {
      return imagesRef.current.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return imagesRef.current.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
        <Paper sx={{display: "flex", flexDirection: "column", gap: 0.25, p: 2}}>
          {images.map((img, index) => (
            <ImageListItem
              key={index}
              fileName={img.fileName}
              name={img.name}
              date={img.date}
              action={(filename: string) => { }}
            />
          ))}
        </Paper>

        <Fab onClick={() => {
          setDialogOpen(true)
        }} size="large" color="primary" sx={{ position: "absolute", bottom: 15, right: 15 }}>
          <Add />
        </Fab>

        <UploadDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={(file: File, name: string) => uploadImage(file, name)}
        />
      </Box>
    </>
  );
}
