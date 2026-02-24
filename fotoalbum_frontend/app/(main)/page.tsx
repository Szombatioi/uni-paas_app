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
import ConfirmDialog from "../components/dialogs/confirm_dialog";
import { useAuth } from "../contexts/auth-context";

export default function Home() {
  const { t } = useTranslation("common");
  const { user, loading } = useAuth();
  const { showMessage } = useSnackbar();
  const [stateLoading, setStateLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDeletableImage, setSelectedDeletableImage] = useState<string | null>(null);
  const [urlPrefix, setUrlPrefix] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  type sortType = "name" | "date";
  type orderType = "asc" | "desc";
  const [sortBy, setSortBy] = useState<sortType>("name");
  const [sortOrder, setSortOrder] = useState<orderType>("asc");
  const sortTypes = [
    { label: t("name"), value: "name" },
    { label: t("date"), value: "date" },
  ];

  const ls_sort_name = "sort";
  const ls_order_name = "order";

  //Saving the selected sort types to localstorage
  const setSortTypes = (sortType: sortType) => {
    localStorage.setItem(ls_sort_name, sortType);
  };

  const setOrderTypes = (orderType: orderType) => {
    localStorage.setItem(ls_order_name, orderType);
  };

  //Loading the selected sort types from localstorage
  const getSortTypes = () => {
    const sort = localStorage.getItem(ls_sort_name);
    const order = localStorage.getItem(ls_order_name);

    if (sort === "name" || sort === "date") {
      setSortBy(sort);
    }

    if (order === "asc" || order === "desc")
      setSortOrder(order);
  }

  const [images, setImages] = useState<ImageDto[]>([]); //TODO: define type
  const imagesRef = useRef<ImageDto[]>([]);

  const uploadImage = async (file: File, imageName: string) => {
    setStateLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", imageName);

    try {
      await api.post("/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchImages();
      showMessage(t("image.upload_success", Severity.success));
    } catch (err) {
      showMessage(t("image.upload_fail", Severity.error));
    } finally {
      setStateLoading(false);
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
    setStateLoading(true);
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
    setStateLoading(false);
  };

  async function fetchImages() {
    getSortTypes();
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
    } finally {
      setStateLoading(false);
    }
  }

  useEffect(() => {
    setStateLoading(true);
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
    setSortOrder((prev) => {
      const newValue = prev === "asc" ? "desc" : "asc";
      setOrderTypes(newValue);
      return newValue;
    });

  };

  const deleteImage = async (fileName: string) => {
    setStateLoading(true);
    try {
      const res = await api.delete(`/image/${fileName}`);
      imagesRef.current = [...imagesRef.current].filter((i) => i.fileName !== fileName);
      setImages(imagesRef.current);
      showMessage(t("image.delete_success"), Severity.success);
    } catch (err) {
      showMessage(t("image.delete_fail"), Severity.error);
    }
    setStateLoading(false);
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
        {loading ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignSelf: 'end', alignItems: 'center', gap: 1 }}>
              {/* Switch */}
              <ButtonGroup variant="outlined" sx={{ alignSelf: 'end' }}>
                {sortTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={sortBy === type.value ? "contained" : "outlined"}
                    onClick={() => {
                      setSortBy(type.value as any);
                      setSortTypes(type.value as sortType)
                    }}
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
              stateLoading ? (
                <>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                  </Box>
                </>
              ) : (
                <>
                  {/* List */}
                  <Paper sx={{ display: "flex", flexDirection: "column", gap: 0.25, p: 2 }}>
                    {images.length === 0 ? (
                      <>
                        <Typography align="center" variant="body2">{t("image.nothing_uploaded")}</Typography>
                      </>
                    ) : (
                      images.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => { openImage(img.fileName); console.log("Image opened") }}>
                          <ImageListItem
                            fileName={img.fileName}
                            name={img.name}
                            date={img.date}
                            action={(fileName: string) => { setConfirmOpen(true); setSelectedDeletableImage(fileName) }}
                            allowDelete={user !== null}
                          />
                        </div>
                      ))
                    )}
                  </Paper>

                  {user && (
                    <>
                      <Fab onClick={() => {
                        setDialogOpen(true)
                      }} size="large" color="primary" sx={{ position: "absolute", bottom: 15, right: 15 }}>
                        <Add />
                      </Fab>
                    </>
                  )}

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

                  {selectedDeletableImage && (<>
                    <ConfirmDialog
                      open={confirmOpen}
                      title={t("confirm.title")}
                      mainText={t("confirm.description") + selectedDeletableImage}
                      cancelLabel={t("cancel")}
                      proceedLabel={t("delete")}
                      onClose={() => setConfirmOpen(false)}
                      onConfirm={async () => deleteImage(selectedDeletableImage)}
                      severity="error" />
                  </>)}
                </>
              )
            }
          </>
        )}
      </Box>
    </>
  );
}
