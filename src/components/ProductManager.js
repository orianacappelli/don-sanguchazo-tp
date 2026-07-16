"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  categories: [],
};

export default function ProductManager({
  initialCategories = [],
  initialProducts = [],
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  // ESTADO NUEVO PARA LOS INGREDIENTES
  const [customizations, setCustomizations] = useState([]); 
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setCustomizations([]); // Limpiamos los ingredientes
    setEditingId("");
  }, []);

  const refreshProducts = useCallback(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleCategoryChange(event) {
    const { checked, value } = event.target;
    setForm((current) => {
      const categories = checked
        ? [...current.categories, value]
        : current.categories.filter((categoryId) => categoryId !== value);
      return { ...current, categories };
    });
  }

  // LÓGICA PARA AGREGAR Y EDITAR LOS INGREDIENTES EN PANTALLA
  const addCustomization = () => {
    setCustomizations([...customizations, { name: "", options: [], defaultOptions: [] }]);
  };

  const updateCustomization = (index, field, value) => {
    const updated = [...customizations];
    if (field === "name") {
      updated[index].name = value;
    } else {
      // Si son las opciones, convertimos el texto separado por comas en un arreglo
      updated[index][field] = value.split(",").map(i => i.trim()).filter(i => i !== "");
    }
    setCustomizations(updated);
  };

  const removeCustomization = (index) => {
    setCustomizations(customizations.filter((_, i) => i !== index));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    
    // Inyectamos nuestro estado de ingredientes adentro del formulario
    formData.append("customizations", JSON.stringify(customizations));

    const action = editingId ? updateProduct.bind(null, editingId) : createProduct;

    try {
      const result = await action(null, formData);
      setMessage(result.message);

      if (result.ok) {
        resetForm();
        refreshProducts();
      }
    } catch {
      setMessage("Ocurrió un error al guardar el producto.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
      categories: (product.categories || []).map((category) =>
        typeof category === "string" ? category : category._id
      ),
    });
    // Cargamos los ingredientes del producto que queremos editar
    setCustomizations(product.customizations || []); 
    setMessage("Editando producto.");
  }

  async function handleDelete(id) {
    const result = await deleteProduct(id);
    if (!result.ok) {
      setMessage(result.message || "No se pudo eliminar el producto.");
      return;
    }
    if (editingId === id) resetForm();
    setMessage(result.message);
    refreshProducts();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Formulario simple para probar los endpoints del CRUD.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
          <textarea className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none" name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
          <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none" name="price" placeholder="Precio" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
          <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none" name="stock" placeholder="Stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
          <input className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none" name="image" placeholder="Nombre de imagen, ej: dummy.webp" value={form.image} onChange={handleChange} />
          
          <fieldset className="rounded-lg border border-slate-300 px-4 py-3">
            <legend className="px-1 text-sm font-medium text-slate-700">Categorías</legend>
            {initialCategories.length === 0 ? (
              <p className="py-2 text-sm text-slate-500">Crea una categoría antes de asociarla a productos.</p>
            ) : (
              <div className="grid gap-3">
                {initialCategories.map((category) => (
                  <label key={category._id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                    <input checked={form.categories.includes(category._id)} className="mt-1 h-4 w-4" name="categories" type="checkbox" value={category._id} onChange={handleCategoryChange} />
                    <span>
                      <span className="block text-sm font-medium text-slate-900">{category.name}</span>
                      {category.description ? <span className="mt-1 block text-xs text-slate-500">{category.description}</span> : null}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          {/* NUEVA SECCIÓN DE CUSTOMIZACIONES (EL TOQUE DE EXPERTO) */}
          <fieldset className="rounded-lg border border-[#157a2c] bg-green-50/30 px-4 py-4">
            <legend className="px-2 text-sm font-bold text-[#157a2c]">Opciones para el Armado</legend>
            
            {customizations.map((custom, index) => (
              <div key={index} className="mb-4 bg-white p-3 rounded-lg border border-green-200 shadow-sm relative">
                <button type="button" onClick={() => removeCustomization(index)} className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700">X</button>
                
                <input 
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm mb-2 font-bold" 
                  placeholder="Categoría (Ej: Pan, Vegetales)" 
                  value={custom.name} 
                  onChange={(e) => updateCustomization(index, "name", e.target.value)} 
                />
                
                <label className="text-xs text-slate-500 font-medium block mb-1">Opciones disponibles (separadas por coma)</label>
                <input 
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm mb-2" 
                  placeholder="Ej: Pan Francés, Pebete" 
                  value={custom.options.join(", ")} 
                  onChange={(e) => updateCustomization(index, "options", e.target.value)} 
                />

                <label className="text-xs text-slate-500 font-medium block mb-1">Opciones marcadas por defecto (separadas por coma)</label>
                <input 
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm bg-green-50" 
                  placeholder="Ej: Pan Francés" 
                  value={custom.defaultOptions?.join(", ") || ""} 
                  onChange={(e) => updateCustomization(index, "defaultOptions", e.target.value)} 
                />
              </div>
            ))}
            
            <button type="button" onClick={addCustomization} className="text-sm font-bold text-[#157a2c] hover:underline w-full text-left mt-2">
              + Agregar ingrediente / opción
            </button>
          </fieldset>

          <div className="flex gap-3 pt-2">
            <button className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white w-full" disabled={isSaving} type="submit">
              {isSaving ? "Guardando..." : editingId ? "Actualizar Producto" : "Crear Producto"}
            </button>
            <button className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700" type="button" onClick={resetForm}>
              Limpiar
            </button>
          </div>
        </form>

        {message ? <p className="mt-4 text-sm font-bold text-[#157a2c] text-center">{message}</p> : null}
      </section>

      {/* SECCIÓN DERECHA: LA LISTA DE PRODUCTOS (NO LA TOCAMOS) */}
      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Productos</h2>
            <p className="mt-2 text-sm text-slate-600">Lista obtenida desde el container del dashboard.</p>
          </div>
          <button className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700" disabled={isRefreshing} type="button" onClick={refreshProducts}>
            {isRefreshing ? "Recargando..." : "Recargar"}
          </button>
        </div>

        {initialProducts.length === 0 ? (
          <p className="mt-6 text-slate-600">Todavía no hay productos cargados.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {initialProducts.map((product) => (
              <article key={product._id} className="rounded-lg border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">{product.description || "Sin descripcion"}</p>
                  </div>
                  <div className="text-right text-sm text-slate-700">
                    <p className="font-bold text-green-700">${product.price}</p>
                    <p>Stock: {product.stock}</p>
                  </div>
                </div>

                {product.categories?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span key={typeof category === "string" ? category : category._id} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                        {typeof category === "string" ? category : category.name}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Mostramos un aviso chiquito si el producto tiene customizaciones */}
                {product.customizations && product.customizations.length > 0 && (
                  <p className="mt-2 text-xs font-bold text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded">
                    Tiene {product.customizations.length} opciones personalizables
                  </p>
                )}

                <div className="mt-4 flex gap-3">
                  <button className="rounded-lg bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900" type="button" onClick={() => handleEdit(product)}>
                    Editar
                  </button>
                  <button className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-900" type="button" onClick={() => handleDelete(product._id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}