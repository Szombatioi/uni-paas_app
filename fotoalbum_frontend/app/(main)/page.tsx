"use client";
import { Box, Button, ButtonGroup, CircularProgress, Fab, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import ImageListItem from "../components/image_list_item";
import { useEffect, useRef, useState } from "react";
import { Add, ArrowDownward, ArrowUpward, ImageNotSupportedTwoTone } from "@mui/icons-material";
import { useDialog } from "../contexts/dialog-context";
import UploadDialog from "../components/dialogs/upload_image.dialog";
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set";
import { useTranslation } from "react-i18next";
import api from "@/axios/auth-axios";
import { Severity, useSnackbar } from "../contexts/snackbar-provider";
import { ImageDto, ImageListDto } from "../components/dto/image.dto";
import ImageViewerDialog from "../components/dialogs/image_viewer_dialog";

export default function Home() {
  const { t } = useTranslation("common");
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [urlPrefix, setUrlPrefix] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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

  // useEffect(() => {
  //   async function fetchImages() {

  //   }
  //   fetchImages();
  // }, [sortBy]);

  //TODO: check if good
  // const sortImages = () => {
  //   if (sortBy === "name") {
  //     imagesRef.current = imagesRef.current.sort((a, b) => a.name.localeCompare(b.name));
  //   } else {
  //     debugger
  //     imagesRef.current = imagesRef.current.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  //   }
  //   setImages(imagesRef.current);
  // }

  const sortImages = () => {
    setLoading(true);
    const sortedData = [...imagesRef.current].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      } else {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      // Flip the result if descending
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setImages(sortedData);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    async function fetchImages() {
      try {
        const res = await api.get<ImageListDto>("/images");
        setImages(res.data.images);
        imagesRef.current = res.data.images;
        setUrlPrefix(res.data.urlPrefix);

        sortImages();
      } catch (err) {
        console.error(err);
        showMessage(t("image.couldnt_fetch"));
        return;
      } finally{
        setLoading(false);
      }
    }
    fetchImages();
  }, [sortBy, sortOrder]);

  const openImage = (filename: string) => {
    setSelectedImage(urlPrefix + filename);
    setImageDialogOpen(true);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setImageDialogOpen(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>

        <Box sx={{ display: 'flex', alignSelf: 'end', alignItems: 'center', gap: 1 }}>
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
          <Tooltip title={sortOrder === "asc" ? t("sort_asc") : t("sort_desc")}>
            <IconButton onClick={toggleSortOrder} color="primary" sx={{ border: '1px solid', borderColor: 'primary.main' }}>
              {sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </Tooltip>
        </Box>

        {
          loading ? (
            <>
              <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <CircularProgress />
              </Box>
            </>
          ) : (
            <>
              {/* List */}
              <Paper sx={{ display: "flex", flexDirection: "column", gap: 0.25, p: 2 }}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => { openImage(img.fileName); console.log("Image opened") }}>
                    <ImageListItem
                      fileName={img.fileName}
                      name={img.name}
                      date={img.date}
                      action={(fileName: string) => { /*TODO: remove image*/ }}
                    />
                  </div>
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

              {selectedImage && (
                <>
                  <ImageViewerDialog
                    open={imageDialogOpen}
                    url={selectedImage}
                    onClose={() => closeImage()}
                  />
                </>)}
            </>
          )
        }
      </Box>
    </>
  );
}
