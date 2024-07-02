"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const invoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string()
});

const createInvoiceSchema = invoiceSchema.omit({id: true, date: true })
const updateInvoiceSchema = invoiceSchema.omit({ id: true, date: true })
const deleteInvoiceSchema = invoiceSchema.pick({ id: true })

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = createInvoiceSchema.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    const amount_in_cents = amount * 100;
    const date = new Date().toISOString().split("T")[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amount_in_cents}, ${status}, ${date})
  `;
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = updateInvoiceSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amount_in_cents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amount_in_cents}, status = ${status}
    WHERE id = ${id}
  `
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(formId: string) {
  throw new Error('Can not delete');
  const { id } = deleteInvoiceSchema.parse({
    id: formId
  });
  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
  `
  revalidatePath("/dashboard/invoices");
}