// app/createBundle/page.tsx
import CreateBundleList from "@/components/bundles/CreateBundleList";
import BundleFilterForm from "@/components/bundles/BundleFilterForm";

export default function CreateBundlePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create Service Bundle</h1>
      <BundleFilterForm />
      <CreateBundleList />
    </div>
  );
}
