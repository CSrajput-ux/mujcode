
---

## Problem 36: The Anagram Grouping
**Difficulty:** Medium  
**Topic:** Strings, Hashing  
**Asked In:** Amazon, Microsoft, Goldman Sachs  

### Problem Description
Given an array of strings, group the **anagrams** together. You can return the answer in any order.

**Constraints:**
- `1 <= strs.length <= 10^4`
- `0 <= strs[i].length <= 100`

### Input Format
- An integer `n`.
- `n` strings.

### Output Format
- Groups of strings.

### Examples

**Example 1:**
```text
Input:
6
eat tea tan ate nat bat

Output:
bat
nat tan
ate eat tea
```

### Solution Expectation
- **Approach:** Map `{sorted_string -> list}`.

---

## Problem 37: The Longest Palindromic Substring
**Difficulty:** Medium  
**Topic:** Strings, DP  
**Asked In:** Amazon, Microsoft, Google  

### Problem Description
Given a string `s`, return the **longest palindromic substring** in `s`.

**Constraints:**
- `1 <= s.length <= 1000`

### Input Format
- A string `s`.

### Output Format
- The substring.

### Examples

**Example 1:**
```text
Input:
babad

Output:
bab
```

### Solution Expectation
- **Approach:** Expand around center O(N^2).

---

## Problem 38: The Palindromic Count
**Difficulty:** Medium  
**Topic:** Strings, DP  
**Asked In:** Facebook, LinkedIn  

### Problem Description
Given a string `s`, determine the **number of palindromic substrings** in it.

### Input Format
- A string `s`.

### Output Format
- Integer count.

### Examples

**Example 1:**
```text
Input:
abc

Output:
3
```

### Solution Expectation
- **Approach:** Expand around center.

---

## Problem 39: The Permutation Inclusion
**Difficulty:** Medium  
**Topic:** Strings, Sliding Window  
**Asked In:** Microsoft, Amazon  

### Problem Description
Given two strings `s1` and `s2`, return `true` if `s2` contains a **permutation** of `s1`.

### Examples

**Example 1:**
```text
Input:
ab
eidbaooo

Output:
true
```

### Solution Expectation
- **Approach:** Sliding Window of size `len(s1)` with frequency map.

---

## Problem 40: The Distinct Palindromic Sequences
**Difficulty:** Hard  
**Topic:** Strings, DP  
**Asked In:** Google, LinkedIn  

### Problem Description
Given a string `s`, find the number of **different non-empty palindromic subsequences** in `s`, modulo `10^9 + 7`.

### Examples

**Example 1:**
```text
Input:
bccb

Output:
6
```

### Solution Expectation
- **Approach:** DP `dp[i][j]`.

---

## Problem 41: The Smallest Window Cover
**Difficulty:** Hard  
**Topic:** Strings, Sliding Window  
**Asked In:** Google, Amazon  

### Problem Description
Given two strings `s` and `t`, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window.

### Examples

**Example 1:**
```text
Input:
ADOBECODEBANC
ABC

Output:
BANC
```

### Solution Expectation
- **Approach:** Sliding Window.

---

## Problem 42: The Wildcard Pattern
**Difficulty:** Hard  
**Topic:** Strings, DP  
**Asked In:** Google, Microsoft  

### Problem Description
Given an input string `s` and a pattern `p`, implement wildcard pattern matching with support for `'?'` and `'*'`.

### Examples

**Example 1:**
```text
Input:
aa
*

Output:
true
```

### Solution Expectation
- **Approach:** DP.

---

## Problem 43: The Pattern Search (KMP)
**Difficulty:** Medium  
**Topic:** Strings, KMP  
**Asked In:** Microsoft  

### Problem Description
Implement KMP algorithm to find first occurrence of `pat` in `txt`.

### Solution Expectation
- **Approach:** KMP.

---

## Problem 44: The Rolling Hash (Rabin-Karp)
**Difficulty:** Hard  
**Topic:** Strings  
**Asked In:** Google  

### Problem Description
Implement Rabin-Karp to find all occurrences.

### Solution Expectation
- **Approach:** Rolling Hash.

---

## Problem 45: The Minimal Operations Transformation
**Difficulty:** Hard  
**Topic:** Strings  
**Asked In:** Google  

### Problem Description
Min operations to convert A to B by moving char to front.

### Solution Expectation
- **Approach:** Backwards matching.

---

# Interview DSA Course - Module 3: Searching & Sorting

---

## Problem 46: The Occurrence Finder
**Difficulty:** Medium  
**Topic:** Searching  
**Asked In:** Amazon  

### Problem Description
Find first and last position of element in sorted array.

### Examples

**Example 1:**
```text
Input:
6
5 7 7 8 8 10
8

Output:
3 4
```

### Solution Expectation
- **Approach:** Binary Search twice.

---

## Problem 47: The Rotated Search II
**Difficulty:** Medium  
**Topic:** Searching  
**Asked In:** Adobe  

### Problem Description
Search in rotated sorted array with duplicates.

### Solution Expectation
- **Approach:** Binary Search with duplicate handling.

---

## Problem 48: The Precise Root
**Difficulty:** Easy  
**Topic:** Searching  
**Asked In:** Amazon  

### Problem Description
Compute square root of x.

### Solution Expectation
- **Approach:** Binary Search.

---

## Problem 49: The Majority Consensus
**Difficulty:** Easy  
**Topic:** Arrays, Sorting  
**Asked In:** Amazon, Google  

### Problem Description
Find majority element (> n/2).

### Solution Expectation
- **Approach:** Moore's Voting.

---

## Problem 50: The Peak Identification
**Difficulty:** Medium  
**Topic:** Searching  
**Asked In:** Google  

### Problem Description
Find peak element index.

### Solution Expectation
- **Approach:** Binary Search.

---

## Problem 51: The Inversion Count
**Difficulty:** Hard  
**Topic:** Sorting  
**Asked In:** Amazon  

### Problem Description
Count inversions in array.

### Solution Expectation
- **Approach:** Merge Sort.

---

## Problem 52: The Quick Partition
**Difficulty:** Medium  
**Topic:** Sorting  
**Asked In:** Standard  

### Problem Description
Implement Quick Sort Partition.

### Solution Expectation
- **Approach:** Pivot logic.

---

## Problem 53: The Book Allocator
**Difficulty:** Hard  
**Topic:** Binary Search  
**Asked In:** Google  

### Problem Description
Minimize max pages allocated to students.

### Solution Expectation
- **Approach:** Binary Search on Answer.

---

## Problem 54: The Aggressive Herders
**Difficulty:** Hard  
**Topic:** Binary Search  
**Asked In:** SPOJ  

### Problem Description
Largest minimum distance between cows.

### Solution Expectation
- **Approach:** Binary Search on Answer.

---

## Problem 55: The Median of Sorted Arrays
**Difficulty:** Hard  
**Topic:** Binary Search  
**Asked In:** Google  

### Problem Description
Find median of two sorted arrays.

### Solution Expectation
- **Approach:** Partitioning.

---
