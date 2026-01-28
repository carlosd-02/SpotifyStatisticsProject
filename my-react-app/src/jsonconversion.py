from pathlib import Path
import csv
import json
import sys
import argparse

def csv_to_json(csv_path: Path, json_path: Path):
    with csv_path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        # map lowercase header -> original header
        header_map = {h.lower(): h for h in fieldnames}
        print(f"Detected CSV headers: {fieldnames}")

        # prefer common simple headers "Name" and "Code" (case-insensitive), then fall back to other common names
        country_key = header_map.get("name") 
        code_key = header_map.get("code")
        print(f"Using country key: {country_key}, code key: {code_key}")

        out = []
        for row in reader:
            country = (row.get(country_key) or "").strip()
            code = (row.get(code_key) or "").strip()
            print(f"Processing row: country='{country}', code='{code}'")
            if country and code:
                out.append({"country": country, "code": code})

    with json_path.open("w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    return len(out)

def main(argv=None):
    parser = argparse.ArgumentParser(description="Convert filtered_data CSV to JSON with objects having 'country' and 'code'.")
    parser.add_argument("input", nargs="?", default=Path(r"C:\\Users\\cdxdj\\Downloads\\filtered_data.csv"), help="input CSV path")
    parser.add_argument("-o", "--output", help="output JSON path (defaults to input with .json suffix)")
    args = parser.parse_args(argv)

    input_path = Path(args.input)
    output_path = Path(args.output) if args.output else input_path.with_suffix(".json")

    try:
        count = csv_to_json(input_path, output_path)
        print(f"Wrote {count} records to {output_path}")
    except FileNotFoundError:
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(2)

if __name__ == "__main__":
    main()