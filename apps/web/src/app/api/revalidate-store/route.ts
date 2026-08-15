import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  const secret = request.headers.get("x-revalidate-secret");

  if (expected && secret !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/faq");
  revalidatePath("/products");

  return NextResponse.json({ ok: true });
}
