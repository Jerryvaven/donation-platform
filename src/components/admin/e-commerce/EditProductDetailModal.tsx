"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
interface EditProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProduct: any) => Promise<void>;
    product: any;
    darkMode?: boolean;
}
const EditProductDetailModal: React.FC<EditProductDetailModalProps> = ({ isOpen, onClose, onSave, product, darkMode = false, }) => {
    const [formData, setFormData] = useState<any>({
        images: [],
        features: [],
        benefits: [],
        specifications: [],
        featureSlides: [],
        questionsAndAnswers: [],
        includedAccessories: [],
    });
    const [newFeature, setNewFeature] = useState("");
    const [newBenefit, setNewBenefit] = useState("");
    const [newSpec, setNewSpec] = useState("");
    const [newImage, setNewImage] = useState("");
    const [newQA, setNewQA] = useState({ question: "", answer: "" });
    const [newFeatureSlide, setNewFeatureSlide] = useState({
        title: "",
        description: "",
        image: "",
    });
    const [newIncludedAccessory, setNewIncludedAccessory] = useState({
        title: "",
        image: "",
        description: "",
    });
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                images: Array.isArray(product.images)
                    ? product.images
                    : product.image
                        ? [product.image]
                        : [],
                features: Array.isArray(product.features) ? product.features : [],
                benefits: Array.isArray(product.benefits) ? product.benefits : [],
                specifications: Array.isArray(product.specifications)
                    ? product.specifications
                    : [],
                featureSlides: Array.isArray(product.featureSlides)
                    ? product.featureSlides
                    : [],
                questionsAndAnswers: Array.isArray(product.questionsAndAnswers)
                    ? product.questionsAndAnswers
                    : [],
                includedAccessories: Array.isArray(product.includedAccessories)
                    ? product.includedAccessories
                    : [],
                warranty: product.warranty || "",
                shipping: product.shipping || "",
                description: product.description || "",
                productDescription: product.productDescription || "",
            });
        }
    }, [product]);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [isOpen]);
    if (!isOpen || !product)
        return null;
    const handleInputChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (Array.isArray(formData.images) && formData.images.length >= 5) {
            alert("Maximum 5 images allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData({
                ...formData,
                images: [...(formData.images || []), base64String],
            });
        };
        reader.readAsDataURL(file);
    };
    const handleSpecImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData({
                ...formData,
                specificationsImage: base64String,
            });
        };
        reader.readAsDataURL(file);
    };
    const handleDimensionsImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData({
                ...formData,
                dimensionsImage: base64String,
            });
        };
        reader.readAsDataURL(file);
    };
    const handleIncludedAccessoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setNewIncludedAccessory({
                ...newIncludedAccessory,
                image: base64String,
            });
        };
        reader.readAsDataURL(file);
    };
    const handleAddItem = (field: string, value: string | {
        title: string;
        image: string;
        description: string;
    }) => {
        if (field === "includedAccessories") {
            const accessory = value as {
                title: string;
                image: string;
                description: string;
            };
            if (accessory.title.trim() &&
                accessory.image.trim() &&
                accessory.description.trim()) {
                if (Array.isArray(formData.includedAccessories) &&
                    formData.includedAccessories.length >= 6) {
                    alert("Maximum 6 included accessories allowed");
                    return;
                }
                setFormData({
                    ...formData,
                    [field]: [...formData[field], accessory],
                });
                setNewIncludedAccessory({ title: "", image: "", description: "" });
            }
        }
        else {
            if (value && typeof value === "string" && value.trim()) {
                setFormData({
                    ...formData,
                    [field]: [...formData[field], value.trim()],
                });
                if (field === "features")
                    setNewFeature("");
                if (field === "benefits")
                    setNewBenefit("");
                if (field === "specifications")
                    setNewSpec("");
                if (field === "images")
                    setNewImage("");
            }
        }
    };
    const handleRemoveItem = (field: string, index: number) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((_: any, i: number) => i !== index),
        });
    };
    const handleAddQA = () => {
        if (newQA.question.trim() && newQA.answer.trim()) {
            setFormData({
                ...formData,
                questionsAndAnswers: [...formData.questionsAndAnswers, { ...newQA }],
            });
            setNewQA({ question: "", answer: "" });
        }
    };
    const handleRemoveQA = (index: number) => {
        setFormData({
            ...formData,
            questionsAndAnswers: formData.questionsAndAnswers.filter((_: any, i: number) => i !== index),
        });
    };
    const handleFeatureSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setNewFeatureSlide({
                ...newFeatureSlide,
                image: base64String,
            });
        };
        reader.readAsDataURL(file);
    };
    const handleAddFeatureSlide = () => {
        if (Array.isArray(formData.featureSlides) &&
            formData.featureSlides.length >= 5) {
            alert("Maximum 5 feature slides allowed");
            return;
        }
        if (newFeatureSlide.title.trim() &&
            newFeatureSlide.description.trim() &&
            newFeatureSlide.image.trim()) {
            setFormData({
                ...formData,
                featureSlides: [...formData.featureSlides, { ...newFeatureSlide }],
            });
            setNewFeatureSlide({ title: "", description: "", image: "" });
        }
    };
    const handleRemoveFeatureSlide = (index: number) => {
        setFormData({
            ...formData,
            featureSlides: formData.featureSlides.filter((_: any, i: number) => i !== index),
        });
    };
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
            setShowErrorModal(true);
        }
        finally {
            setIsSaving(false);
        }
    };
    return (<div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-lg shadow-2xl ${darkMode ? "bg-[#242424] text-white" : "bg-white text-gray-900"}`}>
        
        <div className={`sticky top-0 z-10 flex justify-between items-center p-6 border-b ${darkMode
            ? "bg-[#242424] border-[#333333]"
            : "bg-white border-gray-200"}`}>
          <h2 className="text-2xl font-bold">Edit Product Details</h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition ${darkMode
            ? "hover:bg-gray-700 text-gray-400"
            : "hover:bg-gray-100 text-gray-600"}`}>
            <FaTimes size={24}/>
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div>
            <label className="block mb-2 font-semibold">Product Name</label>
            <input type="text" value={formData.name || ""} onChange={(e) => handleInputChange("name", e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Price</label>
            <input type="text" value={formData.price || ""} onChange={(e) => handleInputChange("price", e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Description</label>
            <textarea value={formData.description || ""} onChange={(e) => handleInputChange("description", e.target.value)} rows={3} className={`w-full p-3 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Product Description
            </label>
            <textarea value={formData.productDescription || ""} onChange={(e) => handleInputChange("productDescription", e.target.value)} rows={5} className={`w-full p-3 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">
              Product Images (Max 5)
            </label>
            <div className="space-y-2 mb-2">
              {Array.isArray(formData.images) &&
            formData.images.map((img: string, idx: number) => (<div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <img src={img} alt={`Product ${idx + 1}`} className="w-16 h-16 object-cover rounded"/>
                    <span className="flex-1 text-sm truncate">
                      {img.substring(0, 50)}...
                    </span>
                    <button onClick={() => handleRemoveItem("images", idx)} className="text-red-500 hover:text-red-700">
                      <FaTrash size={18}/>
                    </button>
                  </div>))}
            </div>

            
            <div className="mb-3">
              <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition ${!Array.isArray(formData.images) || formData.images.length >= 5
            ? "opacity-50 cursor-not-allowed"
            : darkMode
                ? "border-gray-600 hover:border-blue-500 bg-gray-700"
                : "border-gray-300 hover:border-blue-500 bg-gray-50"}`}>
                <FaUpload size={20}/>
                <span>Upload Image from Computer</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={!Array.isArray(formData.images) ||
            formData.images.length >= 5} className="hidden"/>
              </label>
            </div>

            
            <div className="flex gap-2">
              <input type="text" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="Or enter image URL" className={`flex-1 p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
              <button onClick={() => handleAddItem("images", newImage)} disabled={!Array.isArray(formData.images) || formData.images.length >= 5} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <FaPlus size={20}/>
              </button>
            </div>
            {Array.isArray(formData.images) && formData.images.length >= 5 && (<p className="text-sm text-yellow-500 mt-1">
                Maximum 5 images allowed
              </p>)}
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">Features</label>
            <div className="space-y-2 mb-2">
              {Array.isArray(formData.features) &&
            formData.features.map((feature: string, idx: number) => (<div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <span className="flex-1">{feature}</span>
                    <button onClick={() => handleRemoveItem("features", idx)} className="text-red-500 hover:text-red-700">
                      <FaTrash size={18}/>
                    </button>
                  </div>))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add a feature" className={`flex-1 p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
              <button onClick={() => handleAddItem("features", newFeature)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <FaPlus size={20}/>
              </button>
            </div>
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">Benefits</label>
            <div className="space-y-2 mb-2">
              {Array.isArray(formData.benefits) &&
            formData.benefits.map((benefit: string, idx: number) => (<div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <span className="flex-1">{benefit}</span>
                    <button onClick={() => handleRemoveItem("benefits", idx)} className="text-red-500 hover:text-red-700">
                      <FaTrash size={18}/>
                    </button>
                  </div>))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} placeholder="Add a benefit" className={`flex-1 p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
              <button onClick={() => handleAddItem("benefits", newBenefit)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <FaPlus size={20}/>
              </button>
            </div>
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">Specifications</label>
            <div className="space-y-2 mb-2">
              {Array.isArray(formData.specifications) &&
            formData.specifications.length > 0 ? (formData.specifications.map((spec: string, idx: number) => (<div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <span className="flex-1">{spec}</span>
                    <button onClick={() => handleRemoveItem("specifications", idx)} className="text-red-500 hover:text-red-700">
                      <FaTrash size={18}/>
                    </button>
                  </div>))) : (<p className={`text-sm italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No specifications added yet. Add specifications below.
                </p>)}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newSpec} onChange={(e) => setNewSpec(e.target.value)} onKeyPress={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem("specifications", newSpec);
            }
        }} placeholder="Add a specification" className={`flex-1 p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
              <button onClick={() => handleAddItem("specifications", newSpec)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <FaPlus size={20}/>
              </button>
            </div>
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">
              Specifications Image
            </label>

            
            <div className="mb-3">
              <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition ${darkMode
            ? "border-gray-600 hover:border-blue-500 bg-gray-700"
            : "border-gray-300 hover:border-blue-500 bg-gray-50"}`}>
                <FaUpload size={20}/>
                <span>Upload Specifications Image from Computer</span>
                <input type="file" accept="image/*" onChange={handleSpecImageUpload} className="hidden"/>
              </label>
            </div>

            
            <input type="text" value={formData.specificationsImage || ""} onChange={(e) => handleInputChange("specificationsImage", e.target.value)} placeholder="Or enter specifications/technical diagram image URL" className={`w-full p-3 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
            {formData.specificationsImage && (<div className="mt-2">
                <img src={formData.specificationsImage} alt="Specifications preview" className="w-full max-w-md rounded-lg border" onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
            }}/>
              </div>)}
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">
              Questions & Answers
            </label>
            <div className="space-y-3 mb-3">
              {Array.isArray(formData.questionsAndAnswers) &&
            formData.questionsAndAnswers.map((qa: any, idx: number) => (<div key={idx} className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <strong>Q: {qa.question}</strong>
                      <button onClick={() => handleRemoveQA(idx)} className="text-red-500 hover:text-red-700">
                        <FaTrash size={18}/>
                      </button>
                    </div>
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      A: {qa.answer}
                    </p>
                  </div>))}
            </div>
            <div className="space-y-2">
              <input type="text" value={newQA.question} onChange={(e) => setNewQA({ ...newQA, question: e.target.value })} placeholder="Question" className={`w-full p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
              <textarea value={newQA.answer} onChange={(e) => setNewQA({ ...newQA, answer: e.target.value })} placeholder="Answer" rows={3} className={`w-full p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
              <button onClick={handleAddQA} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full">
                <FaPlus size={20} className="inline mr-2"/>
                Add Q&A
              </button>
            </div>
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">
              Feature Slides (Image Gallery with Titles)
            </label>
            <div className="space-y-3 mb-3">
              {Array.isArray(formData.featureSlides) &&
            formData.featureSlides.map((slide: any, idx: number) => (<div key={idx} className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <strong className="block mb-1">{slide.title}</strong>
                        <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {slide.description}
                        </p>
                        {slide.image && (<img src={slide.image} alt={slide.title} className="w-32 h-32 object-cover rounded mt-2" onError={(e) => {
                        (e.target as HTMLImageElement).style.display =
                            "none";
                    }}/>)}
                      </div>
                      <button onClick={() => handleRemoveFeatureSlide(idx)} className="text-red-500 hover:text-red-700">
                        <FaTrash size={18}/>
                      </button>
                    </div>
                  </div>))}
            </div>
            <div className="space-y-2">
              <input type="text" value={newFeatureSlide.title} onChange={(e) => setNewFeatureSlide({
            ...newFeatureSlide,
            title: e.target.value,
        })} placeholder="Slide Title" className={`w-full p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
              <textarea value={newFeatureSlide.description} onChange={(e) => setNewFeatureSlide({
            ...newFeatureSlide,
            description: e.target.value,
        })} placeholder="Slide Description" rows={2} className={`w-full p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>

              
              <div>
                <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition ${darkMode
            ? "border-gray-600 hover:border-blue-500 bg-gray-700"
            : "border-gray-300 hover:border-blue-500 bg-gray-50"}`}>
                  <FaUpload size={20}/>
                  <span>Upload Slide Image from Computer</span>
                  <input type="file" accept="image/*" onChange={handleFeatureSlideImageUpload} className="hidden"/>
                </label>
              </div>

              <input type="text" value={newFeatureSlide.image} onChange={(e) => setNewFeatureSlide({
            ...newFeatureSlide,
            image: e.target.value,
        })} placeholder="Or enter Image URL" className={`w-full p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>

              {newFeatureSlide.image && (<div className="mt-2">
                  <img src={newFeatureSlide.image} alt="Preview" className="w-32 h-32 object-cover rounded" onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
            }}/>
                </div>)}

              <button onClick={handleAddFeatureSlide} disabled={!Array.isArray(formData.featureSlides) ||
            formData.featureSlides.length >= 5} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed">
                <FaPlus size={20} className="inline mr-2"/>
                Add Feature Slide{" "}
                {Array.isArray(formData.featureSlides) &&
            `(${formData.featureSlides.length}/5)`}
              </button>
            </div>
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">
              Included Accessories (Max 6)
            </label>
            <div className="space-y-2 mb-2">
              {Array.isArray(formData.includedAccessories) &&
            formData.includedAccessories.map((accessory: any, idx: number) => (<div key={idx} className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <strong className="block mb-1">
                            {accessory.title}
                          </strong>
                          <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {accessory.description}
                          </p>
                          <img src={accessory.image} alt={accessory.title} className="w-16 h-16 object-contain rounded" onError={(e) => {
                    (e.target as HTMLImageElement).style.display =
                        "none";
                }}/>
                        </div>
                        <button onClick={() => handleRemoveItem("includedAccessories", idx)} className="text-red-500 hover:text-red-700">
                          <FaTrash size={18}/>
                        </button>
                      </div>
                    </div>))}
            </div>
            <div className="space-y-2">
              <input type="text" value={newIncludedAccessory.title} onChange={(e) => setNewIncludedAccessory({
            ...newIncludedAccessory,
            title: e.target.value,
        })} placeholder="Accessory Title" className={`w-full p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>

              
              <div className="mb-2">
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition text-sm ${darkMode
            ? "border-gray-600 hover:border-cyan-500 bg-gray-700"
            : "border-gray-300 hover:border-cyan-500 bg-gray-50"}`}>
                  <FaUpload size={16}/>
                  <span>Upload Image from Computer</span>
                  <input type="file" accept="image/*" onChange={handleIncludedAccessoryImageUpload} className="hidden"/>
                </label>
              </div>

              
              <input type="text" value={newIncludedAccessory.image} onChange={(e) => setNewIncludedAccessory({
            ...newIncludedAccessory,
            image: e.target.value,
        })} placeholder="Or enter image URL" className={`w-full p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>

              
              {newIncludedAccessory.image && (<div className="mt-2">
                  <img src={newIncludedAccessory.image} alt="Accessory preview" className="w-20 h-20 object-contain rounded border" onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
            }}/>
                </div>)}

              <textarea value={newIncludedAccessory.description} onChange={(e) => setNewIncludedAccessory({
            ...newIncludedAccessory,
            description: e.target.value,
        })} placeholder="Accessory Description" rows={2} className={`w-full p-2 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
              <button onClick={() => handleAddItem("includedAccessories", newIncludedAccessory)} disabled={!Array.isArray(formData.includedAccessories) ||
            formData.includedAccessories.length >= 6 ||
            !newIncludedAccessory.title.trim() ||
            !newIncludedAccessory.image.trim() ||
            !newIncludedAccessory.description.trim()} className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full">
                <FaPlus size={20} className="inline mr-2"/>
                Add Included Accessory
              </button>
            </div>
            {Array.isArray(formData.includedAccessories) &&
            formData.includedAccessories.length >= 6 && (<p className="text-sm text-yellow-500 mt-1">
                  Maximum 6 included accessories allowed
                </p>)}
          </div>

          
          <div>
            <label className="block mb-2 font-semibold">Dimensions Image</label>
            
            <div className="mb-3">
              <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition ${darkMode
            ? "border-gray-600 hover:border-blue-500 bg-gray-700"
            : "border-gray-300 hover:border-blue-500 bg-gray-50"}`}>
                <FaUpload size={20}/>
                <span>Upload Dimensions Image from Computer</span>
                <input type="file" accept="image/*" onChange={handleDimensionsImageUpload} className="hidden"/>
              </label>
            </div>

            
            <input type="text" value={formData.dimensionsImage || ""} onChange={(e) => handleInputChange("dimensionsImage", e.target.value)} placeholder="Or enter dimensions diagram image URL" className={`w-full p-3 rounded-lg border ${darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-300"}`}/>
            {formData.dimensionsImage && (<div className="mt-2">
                <img src={formData.dimensionsImage} alt="Dimensions preview" className="w-full max-w-md rounded-lg border" onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
            }}/>
              </div>)}
          </div>

          
          <div className="flex gap-4 pt-6 border-t">
            <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={onClose} disabled={isSaving} className={`flex-1 px-6 py-3 rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${darkMode
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-gray-200 hover:bg-gray-300"}`}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      
      {showErrorModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className={`relative w-full max-w-md p-6 rounded-lg shadow-2xl ${darkMode ? "bg-[#242424] text-white" : "bg-white text-gray-900"}`}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error!</h3>
              <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {errorMessage}
              </p>
              <button onClick={() => setShowErrorModal(false)} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold">
                Try Again
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
export default EditProductDetailModal;
