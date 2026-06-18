import { listServices, serviceCategories } from "@/lib/data/store";
import { ServicesClient } from "./ServicesClient";

export default function ServicesPage() {
  const services = listServices();
  const categories = serviceCategories();
  return <ServicesClient services={services} categories={categories} />;
}
