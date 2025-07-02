// import React, { useState, useEffect, useRef } from "react";
// import {
//   Form,
//   Input,
//   Upload,
//   Button,
//   Select,
//   message,
//   Card,
//   Switch,
// } from "antd";
// import {
//   UploadOutlined,
//   LoadingOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { fireStore } from "../../config/firebase";
// // import { supabase } from "../../config/supabase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { useNavigate, Link } from "react-router-dom";
// // import "../../assets/css/addtopic.css";

// const { Option } = Select;

// const AddContent = () => {
//   const navigate = useNavigate();
//   const editor = useRef(null);
//   const [description, setDescription] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [classes, setClasses] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [addingClass, setAddingClass] = useState(false);
//   const [newClass, setNewClass] = useState("");
//   const [isPaid, setIsPaid] = useState(false); // Toggle for paid content
//   const [form] = Form.useForm();
//   const [contentTypes, setContentTypes] = useState([]);
//   const [newContentType, setNewContentType] = useState("");
//   const [addingContentType, setAddingContentType] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [newSubject, setNewSubject] = useState("");
//   const [addingSubject, setAddingSubject] = useState(false);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       const querySnapshot = await getDocs(collection(fireStore, "classes"));
//       const fetchedClasses = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//       }));
//       setClasses(fetchedClasses);

//       const draft = JSON.parse(localStorage.getItem("draft"));
//       if (draft) {
//         setDescription(draft.description || "");
//         form.setFieldsValue(draft);
//       }
//     };

//     fetchClasses();
//   }, [form]);

//   useEffect(() => {
//     const fetchContentTypes = async () => {
//       try {
//         const querySnapshot = await getDocs(
//           collection(fireStore, "contentTypes")
//         );
//         const types = querySnapshot.docs.map((doc) => ({
//           label: doc.data().label,
//           value: doc.data().value,
//         }));
//         setContentTypes(types);
//       } catch (error) {
//         console.error("Failed to fetch content types:", error);
//         message.error("Error loading content types.");
//       }
//     };

//     fetchContentTypes();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(fireStore, "subjects"));
//         const fetchedSubjects = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           name: doc.data().name,
//         }));
//         setSubjects(fetchedSubjects);
//       } catch (error) {
//         console.error("Failed to fetch subjects:", error);
//         message.error("Error loading subjects.");
//       }
//     };

//     fetchSubjects();
//   }, []);

//   const handleAddContentType = async () => {
//     if (
//       newContentType &&
//       !contentTypes.some(
//         (type) =>
//           type.label.toLowerCase() === newContentType.toLowerCase() ||
//           type.value.toLowerCase() === newContentType.toLowerCase()
//       )
//     ) {
//       setAddingContentType(true);
//       try {
//         const newType = {
//           label: newContentType,
//           value: newContentType.toLowerCase().replace(/\s+/g, "-"),
//         };

//         await addDoc(collection(fireStore, "contentTypes"), newType);
//         setContentTypes([...contentTypes, newType]);
//         setNewContentType("");
//         message.success(`Content type "${newType.label}" added!`);
//       } catch (e) {
//         console.error("Error adding content type:", e);
//         message.error("Failed to add content type.");
//       } finally {
//         setAddingContentType(false);
//       }
//     }
//   };

//   const handleAddSubject = async () => {
//     if (
//       newSubject &&
//       !subjects.some(
//         (sub) => sub.name.toLowerCase() === newSubject.toLowerCase()
//       )
//     ) {
//       setAddingSubject(true);
//       try {
//         const docRef = await addDoc(collection(fireStore, "subjects"), {
//           name: newSubject,
//         });
//         setSubjects([...subjects, { id: docRef.id, name: newSubject }]);
//         setNewSubject("");
//         message.success(`Subject "${newSubject}" added successfully!`, 3);
//       } catch (e) {
//         console.error("Error adding subject:", e);
//         message.error("Failed to add subject.", 3);
//       } finally {
//         setAddingSubject(false);
//       }
//     }
//   };

//   const onFinish = async (values) => {
//     const {
//       topic,
//       class: selectedClasses,
//       subject,
//       contentType,
//       file,
//     } = values;

//     setUploading(true);
//     let fileUrls = [];

//     // try {
//     //   if (file && file.length > 0) {
//     //     const uploadPromises = file.map(async (fileItem) => {
//     //       const uniqueFileName = `${Date.now()}-${fileItem.name}`;
//     //       const { data, error } = await supabase.storage
//     //         .from("topics") // your Supabase bucket name
//     //         .upload(uniqueFileName, fileItem.originFileObj, {
//     //           cacheControl: "3600",
//     //           upsert: false,
//     //         });

//     //       if (error) {
//     //         console.error("Upload failed:", error.message);
//     //         message.error("File upload failed.", 3);
//     //         throw error;
//     //       }

//     //       const {
//     //         data: { publicUrl },
//     //       } = supabase.storage.from("topics").getPublicUrl(data.path);

//     //       fileUrls.push({ url: publicUrl, fileName: fileItem.name });
//     //     });
//     //     await Promise.all(uploadPromises);
//     //   }

//     //   const topicData = {
//     //     topic: topic || "",
//     //     class: selectedClasses.join(", "),
//     //     subject: (subject || "").trim().toLowerCase(), // keep only this one
//     //     contentType: contentType || "",
//     //     ecatcontentType: values.ecatContentType || "",
//     //     description: description || "",
//     //     fileUrls,
//     //     isPaid: isPaid,
//     //     timestamp: new Date(),
//     //   };
//     //   console.log("Topic Data:", topicData);

//     //   await addDoc(collection(fireStore, "topics"), topicData);

//     //   if (isPaid) {
//     //     // Changed collection name here only
//     //     await addDoc(collection(fireStore, "premiumtests"), topicData);
//     //   }

//     //   message.success("Topic created successfully!", 3);
//     //   localStorage.removeItem("draft");
//     //   form.resetFields();
//     //   setDescription("");
//     //   setIsPaid(false);
//     // } catch (e) {
//     //   console.error("Error saving topic:", e);
//     //   message.error("Failed to save topic.", 3);
//     // } finally {
//     //   setUploading(false);
//     // }

//   };

//   const handleAddClass = async () => {
//     if (newClass && !classes.some((cls) => cls.name === newClass)) {
//       setAddingClass(true);
//       try {
//         const docRef = await addDoc(collection(fireStore, "classes"), {
//           name: newClass,
//         });
//         setClasses([...classes, { id: docRef.id, name: newClass }]);
//         setNewClass("");
//         message.success(`Class "${newClass}" added successfully!`, 3);
//       } catch (e) {
//         console.error("Error adding class:", e);
//         message.error("Failed to add class.", 3);
//       } finally {
//         setAddingClass(false);
//       }
//     }
//   };

//   return (
//     <div className="form-container mt-2">
//       <h1 className="text-center mb-2 py-5">Create New Topic</h1>

//       <Card
//         bordered={false}
//         style={{ margin: "20px auto", width: "100%", borderRadius: "10px" }}
//       >
//         <Form
//           layout="vertical"
//           onFinish={onFinish}
//           autoComplete="off"
//           form={form}
//         >
//           <Form.Item label="Topic Name" name="topic">
//             <Input placeholder="Enter topic name" />
//           </Form.Item>

//           <Form.Item
//             label="Class"
//             name="class"
//             rules={[{ required: true, message: "Please select a class!" }]}
//           >
//             <Select
//               mode="multiple"
//               placeholder="Select class(es)"
//               onChange={(value) => setSelectedClasses(value)} // ← track class changes
//               dropdownRender={(menu) => (
//                 <>
//                   {menu}
//                   <div
//                     style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
//                   >
//                     <Input
//                       style={{ flex: "auto" }}
//                       placeholder="Add new class"
//                       value={newClass}
//                       onChange={(e) => setNewClass(e.target.value)}
//                       onPressEnter={handleAddClass}
//                     />
//                     <Button
//                       type="primary"
//                       icon={
//                         addingClass ? <LoadingOutlined /> : <PlusOutlined />
//                       }
//                       onClick={handleAddClass}
//                     >
//                       {addingClass ? "Adding..." : "Add"}
//                     </Button>
//                   </div>
//                 </>
//               )}
//             >
//               {classes.map((classOption) => (
//                 <Option key={classOption.id} value={classOption.name}>
//                   {classOption.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Subject"
//             name="subject"
//             rules={[{ required: true, message: "Please select a subject!" }]}
//           >
//             <Select
//               placeholder="Select a subject"
//               dropdownRender={(menu) => (
//                 <>
//                   {menu}
//                   <div
//                     style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
//                   >
//                     <Input
//                       style={{ flex: "auto" }}
//                       placeholder="Add new subject"
//                       value={newSubject}
//                       onChange={(e) => setNewSubject(e.target.value)}
//                       onPressEnter={handleAddSubject}
//                     />
//                     <Button
//                       type="primary"
//                       icon={
//                         addingSubject ? <LoadingOutlined /> : <PlusOutlined />
//                       }
//                       onClick={handleAddSubject}
//                     >
//                       {addingSubject ? "Adding..." : "Add"}
//                     </Button>
//                   </div>
//                 </>
//               )}
//             >
//               {subjects.map((subject) => (
//                 <Option key={subject.id} value={subject.name}>
//                   {subject.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//   label="Content Type"
//   name="contentType"
//   rules={[{ required: true, message: "Please select a content type!" }]}
// >
//   <Select
//     placeholder="Select content type"
//     dropdownRender={(menu) => (
//       <>
//         {menu}
//         <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
//           <Input
//             style={{ flex: "auto" }}
//             placeholder="Add new content type"
//             value={newContentType}
//             onChange={(e) => setNewContentType(e.target.value)}
//             onPressEnter={handleAddContentType}
//           />
//           <Button
//             type="primary"
//             icon={addingContentType ? <LoadingOutlined /> : <PlusOutlined />}
//             onClick={handleAddContentType}
//           >
//             {addingContentType ? "Adding..." : "Add"}
//           </Button>
//         </div>
//       </>
//     )}
//   >
//     {contentTypes.map((type) => (
//       <Option key={type.value} value={type.value}>
//         {type.label}
//       </Option>
//     ))}
//   </Select>
// </Form.Item>

//           <Form.Item label="Description" name="description">
//             <Input.TextArea
//               placeholder="Enter description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Upload File"
//             name="file"
//             valuePropName="fileList"
//             getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
//           >
//             <Upload
//               name="file"
//               beforeUpload={() => false}
//               accept=".jpg,.jpeg,.png,.pdf"
//               multiple
//             >
//               <Button icon={<UploadOutlined />}>Click to Upload</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item label="Upload as Paid Content">
//             <Switch
//               checked={isPaid}
//               onChange={(checked) => setIsPaid(checked)}
//             />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={uploading}
//               style={{ width: "100%" }}
//             >
//               {uploading ? "Uploading..." : "Create Topic"}
//             </Button>
//           </Form.Item>

//           {/* Added Links to Dashboard */}
//           <div className="additional-links">
//             <Link to="/dashboard/allowusers" style={{ marginRight: 20 }}>
//               Manage Users
//             </Link>
//             <Link to="/dashboard/manageContent">Manage Content</Link>
//           </div>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default AddContent;

import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Card,
  Switch,
  Upload,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { storage, fireStore } from "../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
// import "../../assets/css/dashboardhome.css";

const { Option } = Select;
const { Dragger } = Upload;

const AddContent = () => {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [addingClass, setAddingClass] = useState(false);
  const [newClass, setNewClass] = useState("");
  const [savingDraft, setSavingDraft] = useState(false);
  const [isMCQ, setIsMCQ] = useState(false);
  const [mcqs, setMcqs] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "", logic: "" },
  ]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [noteFile, setNoteFile] = useState(null);
  const [noteUploading, setNoteUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSubCategory, setAddingSubCategory] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchClasses = async () => {
      const querySnapshot = await getDocs(collection(fireStore, "classes"));
      const fetchedClasses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setClasses(fetchedClasses);

      const draft = JSON.parse(localStorage.getItem("draft"));
      if (draft) {
        setDescription(draft.description || "");
        form.setFieldsValue(draft);
        if (draft.mcqs) {
          setMcqs(draft.mcqs);
          setIsMCQ(true);
        }
        if (draft.featuredImage) {
          setFeaturedImage(draft.featuredImage);
        }
      }
    };

    fetchClasses();
  }, [form]);

  const uploadFeaturedImage = async (file) => {
    setImageUploading(true);
    try {
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `featured-images/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Image upload failed:", error);
            message.error("Featured image upload failed.", 3);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setFeaturedImage(downloadURL);
            message.success("Featured image uploaded successfully!", 3);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading featured image:", error);
      message.error("Error uploading featured image", 3);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const uploadNoteFile = async (file) => {
    setNoteUploading(true);
    try {
      const sanitizedName = file.name.replace(/\s+/g, "-");
      const uniqueFileName = `${Date.now()}-${sanitizedName}`;
      const storageRef = ref(storage, `note-files/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            message.error("Note file upload failed");
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setNoteFile(downloadURL);
            message.success("Note file uploaded!");
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Upload error:", error);
      message.error("PDF upload failed");
      throw error;
    } finally {
      setNoteUploading(false);
    }
  };

  const onFinish = async (values) => {
    const { topic, class: selectedClasses, category, subCategory } = values;
    setUploading(true);

    let featuredImageUrl = null;
    if (featuredImage) {
      featuredImageUrl = featuredImage;
    }

    try {
      const topicData = {
        topic: topic || "",
        class: selectedClasses.join(", "),
        category: category || "",
        subCategory: isMCQ ? "MCQ Test" : subCategory,
        description: description || "",
        mcqs: isMCQ ? mcqs : [],
        timestamp: new Date(),
        featuredImage: featuredImageUrl,
        notesFile: noteFile,
      };

      await addDoc(collection(fireStore, "topics"), topicData);
      message.success("Topic created successfully!", 3);
      localStorage.removeItem("draft");
      navigate("/ManageProducts");
    } catch (e) {
      console.error("Error adding document:", e);
      message.error("Failed to save topic.", 3);
    } finally {
      setUploading(false);
    }
  };

  const handleAddClass = async () => {
    if (newClass && !classes.some((cls) => cls.name === newClass)) {
      setAddingClass(true);
      try {
        const docRef = await addDoc(collection(fireStore, "classes"), {
          name: newClass,
        });
        setClasses([...classes, { id: docRef.id, name: newClass }]);
        setNewClass("");
        message.success(`Class ${newClass} added successfully!`, 3);
      } catch (e) {
        console.error("Error adding class:", e);
        message.error("Failed to add class.", 3);
      } finally {
        setAddingClass(false);
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory && !categories.some((cat) => cat.name === newCategory)) {
      setAddingCategory(true);
      try {
        const docRef = await addDoc(collection(fireStore, "categories"), {
          name: newCategory,
        });
        setCategories([...categories, { id: docRef.id, name: newCategory }]);
        setNewCategory("");
        message.success(`Category ${newCategory} added successfully!`, 3);
      } catch (e) {
        console.error("Error adding category:", e);
        message.error("Failed to add category.", 3);
      } finally {
        setAddingCategory(false);
      }
    }
  };

  const handleAddSubCategory = async () => {
    if (
      newSubCategory &&
      !subCategories.some((sub) => sub.name === newSubCategory)
    ) {
      setAddingSubCategory(true);
      try {
        const docRef = await addDoc(collection(fireStore, "subcategories"), {
          name: newSubCategory,
        });
        setSubCategories([
          ...subCategories,
          { id: docRef.id, name: newSubCategory },
        ]);
        setNewSubCategory("");
        message.success(`Subcategory ${newSubCategory} added successfully!`, 3);
      } catch (e) {
        console.error("Error adding subcategory:", e);
        message.error("Failed to add subcategory.", 3);
      } finally {
        setAddingSubCategory(false);
      }
    }
  };

  const handleSaveDraft = async (values) => {
    setSavingDraft(true);
    try {
      const draftData = {
        ...values,
        description,
        mcqs,
        featuredImage,
      };
      localStorage.setItem("draft", JSON.stringify(draftData));
      message.success("Draft saved successfully!", 3);
    } catch (error) {
      message.error("Error saving draft", 3);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem("draft");
    form.resetFields();
    setDescription("");
    setMcqs([
      { question: "", options: ["", "", "", ""], correctAnswer: "", logic: "" },
    ]);
    setIsMCQ(false);
    setFeaturedImage(null);
    message.success("Draft cleared!", 3);
  };

  const handleMCQChange = (index, key, value) => {
    const updatedMcqs = [...mcqs];
    updatedMcqs[index][key] = value;
    setMcqs(updatedMcqs);
  };

  const handleOptionChange = (mcqIndex, optionIndex, value) => {
    const updatedMcqs = [...mcqs];
    const oldOption = updatedMcqs[mcqIndex].options[optionIndex];
    updatedMcqs[mcqIndex].options[optionIndex] = value;

    // Update correct answer if it was the changed option
    if (updatedMcqs[mcqIndex].correctAnswer === oldOption) {
      updatedMcqs[mcqIndex].correctAnswer = value;
    }

    setMcqs(updatedMcqs);
  };

  const handleCorrectAnswerChange = (mcqIndex, value) => {
    const updatedMcqs = [...mcqs];
    updatedMcqs[mcqIndex].correctAnswer = value;
    setMcqs(updatedMcqs);
  };

  const handleAddMCQ = () => {
    setMcqs([
      ...mcqs,
      { question: "", options: ["", "", "", ""], correctAnswer: "", logic: "" },
    ]);
  };

  const handleRemoveMCQ = (index) => {
    if (mcqs.length > 1) {
      const updatedMcqs = [...mcqs];
      updatedMcqs.splice(index, 1);
      setMcqs(updatedMcqs);
    } else {
      message.warning("At least one MCQ is required");
    }
  };

  const renderMCQTemplate = () => {
    return mcqs.map((mcq, index) => (
      <div
        key={index}
        style={{
          marginBottom: "16px",
          padding: "16px",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h4>MCQ {index + 1}</h4>
          <Button
            type="link"
            danger
            onClick={() => handleRemoveMCQ(index)}
            disabled={mcqs.length <= 1}
          >
            Remove
          </Button>
        </div>
        <Form.Item label="Question" required>
          <JoditEditor
            value={mcq.question}
            config={mcqJoditConfig}
            onChange={(newContent) =>
              handleMCQChange(index, "question", newContent)
            }
          />
        </Form.Item>
        <Form.Item label="Options" required>
          {mcq.options.map((option, optionIndex) => (
            <div key={optionIndex} style={{ marginBottom: "8px" }}>
              <Input
                addonBefore={
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={mcq.correctAnswer === option}
                    onChange={() => handleCorrectAnswerChange(index, option)}
                  />
                }
                value={option}
                onChange={(e) =>
                  handleOptionChange(index, optionIndex, e.target.value)
                }
                placeholder={`Option ${optionIndex + 1}`}
              />
            </div>
          ))}
        </Form.Item>
        <Form.Item label="Logic for Correct Answer (Optional)">
          <JoditEditor
            value={mcq.logic}
            config={mcqJoditConfig}
            onChange={(newContent) =>
              handleMCQChange(index, "logic", newContent)
            }
          />
        </Form.Item>
      </div>
    ));
  };

  const joditConfig = {
    readonly: false,
    height: 300,
    width: "100%",
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "align",
      "outdent",
      "indent",
      "|",
      "cut",
      "copy",
      "paste",
      "copyformat",
      "|",
      "hr",
      "table",
      "link",
      "|",
      "undo",
      "redo",
      "|",
      "preview",
      "print",
      "find",
      "fullsize",
      "image",
      "video",
      "file",
    ],
    uploader: {
      insertImageAsBase64URI: false,
      url: "/api/upload",
      format: "json",
      imagesExtensions: ["jpg", "png", "jpeg", "gif"],
      filesVariableName: "files",
      withCredentials: false,
      prepareData: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
        return formData;
      },
      isSuccess: (resp) => resp.success,
      getMessage: (resp) => resp.message,
      process: (resp) => ({
        files: resp.files || [],
        path: resp.path || "",
        baseurl: resp.baseurl || "",
        error: resp.error || 0,
        message: resp.message || "",
      }),
      error: (e) => {
        console.error("Upload error:", e);
        message.error("Image upload failed");
      },
      defaultHandlerSuccess: (data) => {
        const { files } = data;
        if (files && files.length) {
          return files[0];
        }
        return "";
      },
    },
    imageDefaultWidth: 300,
    imagePosition: "center",
    spellcheck: true,
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: true,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    allowTabNavigtion: false,
    placeholder: "Type your content here...",
  };

  const mcqJoditConfig = {
    ...joditConfig,
    height: 150,
    buttons:
      "bold,italic,underline,strikethrough,ul,ol,font,fontsize,brush,paragraph,align,link,image",
  };

  const beforeImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
    }
    return isImage && isLt5M;
  };

  const handleImageUpload = async (options) => {
    const { file } = options;
    try {
      const url = await uploadFeaturedImage(file);
      return url;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  return (
    <div className="form-container mt-2">
      <h1 className="text-center mb-2">Create Topic</h1>
      <Card
        bordered={false}
        style={{ margin: "20px auto", width: "100%", borderRadius: "10px" }}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item label="Featured Image (Optional)">
            <Dragger
              name="featuredImage"
              multiple={false}
              beforeUpload={beforeImageUpload}
              customRequest={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag image to upload</p>
              <p className="ant-upload-hint">
                Upload a featured image for this topic (Max 5MB)
              </p>
            </Dragger>
            {featuredImage && (
              <div style={{ marginTop: "16px" }}>
                <img
                  src={featuredImage}
                  alt="Featured preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "4px",
                  }}
                />
                <Button
                  type="link"
                  danger
                  onClick={() => setFeaturedImage(null)}
                  style={{ marginTop: "8px" }}
                >
                  Remove Image
                </Button>
              </div>
            )}
            {imageUploading && (
              <LoadingOutlined style={{ marginLeft: "8px" }} />
            )}
          </Form.Item>

          <Form.Item
            label="Topic Name"
            name="topic"
            rules={[{ required: true, message: "Please enter topic name!" }]}
          >
            <Input placeholder="Enter topic name" />
          </Form.Item>

          <Form.Item
            label="Class"
            name="class"
            rules={[{ required: true, message: "Please select a class!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select class(es)"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ display: "flex", padding: 8 }}>
                    <Input
                      style={{ flex: "auto" }}
                      placeholder="Add new class"
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      onPressEnter={handleAddClass}
                    />
                    <Button
                      type="primary"
                      icon={
                        addingClass ? <LoadingOutlined /> : <PlusOutlined />
                      }
                      onClick={handleAddClass}
                    >
                      {addingClass ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </>
              )}
            >
              {classes.map((cls) => (
                <Option key={cls.id} value={cls.name}>
                  {cls.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
  placeholder="Select category"
  dropdownRender={(menu) => (
    <>
      {menu}
      <div style={{ display: "flex", padding: 8 }}>
        <Input
          style={{ flex: "auto" }}
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onPressEnter={handleAddCategory}
        />
        <Button
          type="primary"
          icon={addingCategory ? <LoadingOutlined /> : <PlusOutlined />}
          onClick={handleAddCategory}
        >
          {addingCategory ? "Adding..." : "Add"}
        </Button>
      </div>
    </>
  )}
>
  {categories.map((cat) => (
    <Option key={cat.id} value={cat.name}>
      {cat.name}
    </Option>
  ))}
</Select>

          </Form.Item>

          <Form.Item
            label="SubCategory"
            name="subCategory"
            rules={[
              { required: true, message: "Please select a subcategory!" },
            ]}
          >
            <Select
  placeholder="Select subcategory"
  dropdownRender={(menu) => (
    <>
      {menu}
      <div style={{ display: "flex", padding: 8 }}>
        <Input
          style={{ flex: "auto" }}
          placeholder="Add new subcategory"
          value={newSubCategory}
          onChange={(e) => setNewSubCategory(e.target.value)}
          onPressEnter={handleAddSubCategory}
        />
        <Button
          type="primary"
          icon={
            addingSubCategory ? <LoadingOutlined /> : <PlusOutlined />
          }
          onClick={handleAddSubCategory}
        >
          {addingSubCategory ? "Adding..." : "Add"}
        </Button>
      </div>
    </>
  )}
>
  {subCategories.map((sub) => (
    <Option key={sub.id} value={sub.name}>
      {sub.name}
    </Option>
  ))}
</Select>

          </Form.Item>

          <Form.Item label="Attach Notes">
            <Upload
              accept=".pdf"
              showUploadList={false}
              beforeUpload={(file) => {
                const isValid = file.type === "application/pdf";
                const isLt10M = file.size / 1024 / 1024 < 10;

                if (!isValid) message.error("Only PDF files allowed!");
                if (!isLt10M) message.error("File must be smaller than 10MB!");

                return (isValid && isLt10M) || Upload.LIST_IGNORE;
              }}
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  const url = await uploadNoteFile(file);
                  onSuccess(url);
                } catch (err) {
                  onError(err);
                  message.error("File upload failed");
                }
              }}
            >
              <Button icon={<UploadOutlined />} loading={noteUploading}>
                {noteUploading ? "Uploading..." : "Upload PDF Notes"}
              </Button>
            </Upload>
            {noteFile && (
              <div style={{ marginTop: 8 }}>
                <a
                  href={noteFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: 8 }}
                >
                  View Uploaded PDF
                </a>
                <Button type="link" danger onClick={() => setNoteFile(null)}>
                  Remove
                </Button>
              </div>
            )}
          </Form.Item>

          <Form.Item label="MCQ Test" name="mcqSwitch" valuePropName="checked">
            <Switch checked={isMCQ} onChange={(checked) => setIsMCQ(checked)} />
          </Form.Item>

          <Form.Item label="Description">
            <JoditEditor
              ref={editor}
              value={description}
              config={joditConfig}
              onBlur={(newContent) => setDescription(newContent)}
            />
          </Form.Item>

          {isMCQ && (
            <>
              {renderMCQTemplate()}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={handleAddMCQ}
                  block
                  icon={<PlusOutlined />}
                >
                  Add More MCQs
                </Button>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={uploading}>
              {uploading ? "Submitting..." : "Submit"}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              block
              onClick={() => navigate("/ManageProducts")}
            >
              Manage Topics
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              block
              icon={<SaveOutlined />}
              onClick={() => handleSaveDraft(form.getFieldsValue())}
              loading={savingDraft}
            >
              {savingDraft ? "Saving Draft..." : "Save as Draft"}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="danger" block onClick={handleClearDraft}>
              Clear Draft
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddContent;
