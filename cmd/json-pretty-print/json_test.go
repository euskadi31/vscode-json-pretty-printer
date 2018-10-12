// Copyright 2018 Axel Etcheverry. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

package main

import (
	"bytes"
	"strings"
	"testing"
)

func TestJSONPrettyPrinterProcessWithSpaceSize2(t *testing.T) {
	formatter := NewJSONPrettyPrinter(TabStyleTypeSpace, 2)

	in := strings.NewReader(`{"foo":true}`)
	var out bytes.Buffer

	if err := formatter.Process(in, &out); err != nil {
		t.Fatalf("formatter.Process() gave error: %s", err)
	}

	got := out.String()
	var want = "{\n  \"foo\": true\n}\n"
	if got != want {
		t.Errorf("formatter.Process() = %q, want %q", got, want)
	}
}

func TestJSONPrettyPrinterProcessWithSpaceSize4(t *testing.T) {
	formatter := NewJSONPrettyPrinter(TabStyleTypeSpace, 4)

	in := strings.NewReader(`{"foo":true}`)
	var out bytes.Buffer

	if err := formatter.Process(in, &out); err != nil {
		t.Fatalf("formatter.Process() gave error: %s", err)
	}

	got := out.String()
	var want = "{\n    \"foo\": true\n}\n"
	if got != want {
		t.Errorf("formatter.Process() = %q, want %q", got, want)
	}
}

func TestJSONPrettyPrinterProcessWithTab(t *testing.T) {
	formatter := NewJSONPrettyPrinter(TabStyleTypeTab, 4)

	in := strings.NewReader(`{"foo":true}`)
	var out bytes.Buffer

	if err := formatter.Process(in, &out); err != nil {
		t.Fatalf("formatter.Process() gave error: %s", err)
	}

	got := out.String()
	var want = "{\n\t\"foo\": true\n}\n"
	if got != want {
		t.Errorf("formatter.Process() = %q, want %q", got, want)
	}
}

func TestJSONPrettyPrinterProcessWithBadJSON(t *testing.T) {
	formatter := NewJSONPrettyPrinter(TabStyleTypeTab, 4)

	in := strings.NewReader(`{"foo":true`)
	var out bytes.Buffer

	if err := formatter.Process(in, &out); err == nil {
		t.Fatalf("formatter.Process() did not give an error: %s", err)
	}
}

func TestJSONPrettyPrinterProcessWithMultiJSON(t *testing.T) {
	formatter := NewJSONPrettyPrinter(TabStyleTypeTab, 4)

	in := strings.NewReader("{\"foo\":true}\n{\"foo\":true}")
	var out bytes.Buffer

	if err := formatter.Process(in, &out); err != nil {
		t.Fatalf("formatter.Process() gave error: %s", err)
	}

	got := out.String()
	var want = "{\n\t\"foo\": true\n}\n{\n\t\"foo\": true\n}\n"
	if got != want {
		t.Errorf("formatter.Process() = %q, want %q", got, want)
	}
}
