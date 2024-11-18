import { Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type CustomFormFieldProps = {
  name: string;
  control: Control<any>;
  labelText?: string;
  type?: string;
  placeholder?: string;
  isTextarea?: boolean; // New prop to determine if the field is a textarea
};

export function CustomFormField({
  name,
  control,
  labelText,
  type = "text",
  placeholder,
  isTextarea = false, // Default to false
}: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{labelText || name}</FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea {...field} placeholder={placeholder} />
            ) : (
              <Input {...field} type={type} placeholder={placeholder} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
type CustomFormSelectProps = {
  name: string;
  control: Control<any>;
  items: string[];
  labelText?: string; // Optional custom label
};

export function CustomFormSelect({
  name,
  control,
  items,
  labelText,
}: CustomFormSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{labelText || name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${labelText || name}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type CustomFormMultiSelectProps = {
  name: string;
  control: Control<any>;
  items: string[];
  labelText?: string;
};

export function CustomFormMultiSelect({
  name,
  control,
  items,
  labelText,
}: CustomFormMultiSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{labelText || name}</FormLabel>
          <FormControl>
            <div className="flex flex-col space-y-2">
              {items.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value?.includes(item)}
                    onCheckedChange={(checked) => {
                      const valueArray = field.value || [];
                      if (checked) {
                        field.onChange([...valueArray, item]);
                      } else {
                        field.onChange(
                          valueArray.filter((val: string) => val !== item)
                        );
                      }
                    }}
                  />
                  <label>{item}</label>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default { CustomFormField, CustomFormSelect, CustomFormMultiSelect };
